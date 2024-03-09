"use client"

import Blocked from "@components/shared/blocked"

import "@styles/global.css"

import { useParams, usePathname } from "next/navigation"

import { FC, PropsWithChildren, useCallback, useEffect } from "react"

import { GoogleOAuthProvider } from "@react-oauth/google"
import { Analytics } from "@vercel/analytics/react"
import { ThemeProvider } from "next-themes"
import NProgress from "nprogress"
import { Toaster } from "react-hot-toast"
import { SWRConfig } from "swr"

import { useUser, useWorkspace } from "@hooks/store"
import useUserAuth from "@hooks/use-user-auth"

import PostHogProvider from "@contexts/PosthogContext"
import { StoreProvider } from "@contexts/StoreContext"

import { SWR_CONFIG } from "@constants/swr-config"
import { THEMES } from "@constants/themes"

import CrispWrapper from "@wrappers/CrispWrapper"
import StoreWrapper from "@wrappers/StoreWrapper"

import { isMobileDevice } from "@helpers/common.helper"

// nprogress
NProgress.configure({ showSpinner: false })

const RootLayout: FC<PropsWithChildren> = function ({ children }) {
    const {
        currentUser,
        currentUserLoader,
        membership: { currentProjectRole, currentWorkspaceRole },
    } = useUser()
    const { currentWorkspace } = useWorkspace()
    const {} = useUserAuth({ user: currentUser, isUserLoading: currentUserLoader })
    const params = useParams()
    const pathname = usePathname()
    const handleBeforeLoad = useCallback(() => {
        console.info("Starting progress bar...")
        NProgress.start()
    }, [])
    useEffect(() => {
        window.addEventListener("beforeunload", handleBeforeLoad)
        return () => {
            console.info("Removing progress bar listener...")
            window.removeEventListener("beforeunload", handleBeforeLoad)
        }
    }, [pathname, params, handleBeforeLoad])

    if (typeof window !== "undefined" && navigator && isMobileDevice(navigator.userAgent))
        return (
            <div className="flex h-screen justify-center">
                <Blocked />
            </div>
        )
    return (
        <html lang="en">
            <body>
                <Toaster />
                <Analytics />
                <GoogleOAuthProvider clientId={process.env["NEXT_PUBLIC_GOOGLE_SSO_CLIENT_ID"] ?? ""}>
                    <StoreProvider>
                        <ThemeProvider themes={THEMES} defaultTheme="system">
                            <StoreWrapper>
                                <CrispWrapper user={currentUser}>
                                    <PostHogProvider
                                        user={currentUser}
                                        currentWorkspaceId={currentWorkspace?.id}
                                        workspaceRole={currentWorkspaceRole}
                                        projectRole={currentProjectRole}
                                    >
                                        <SWRConfig value={SWR_CONFIG}>{children}</SWRConfig>
                                    </PostHogProvider>
                                </CrispWrapper>
                            </StoreWrapper>
                        </ThemeProvider>
                    </StoreProvider>
                </GoogleOAuthProvider>
            </body>
        </html>
    )
}

export default RootLayout

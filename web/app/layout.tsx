"use client"

import Blocked from "@components/shared/blocked"

import "@styles/global.css"

import { FC, PropsWithChildren } from "react"

import { GoogleOAuthProvider } from "@react-oauth/google"
import { Analytics } from "@vercel/analytics/react"
import { ThemeProvider } from "next-themes"
import { Toaster } from "react-hot-toast"
import { SWRConfig } from "swr"

import { useUser, useWorkspace } from "@hooks/store"
import useUserAuth from "@hooks/use-user-auth"

import PostHogProvider from "@contexts/PosthogContext"
import ProgressBarProvider from '@contexts/ProgressBarProvider';
import { StoreProvider } from "@contexts/StoreContext"

import { SWR_CONFIG } from "@constants/swr-config"
import { THEMES } from "@constants/themes"

import CrispWrapper from "@wrappers/CrispWrapper"
import StoreWrapper from "@wrappers/StoreWrapper"

import { isMobileDevice } from "@helpers/common.helper"

const RootLayout: FC<PropsWithChildren> = function ({ children }) {
    const {
        currentUser,
        currentUserLoader,
        membership: { currentProjectRole, currentWorkspaceRole },
    } = useUser()
    const { currentWorkspace } = useWorkspace()
    const {} = useUserAuth({ user: currentUser, isUserLoading: currentUserLoader })
    if (typeof window !== "undefined" && navigator && isMobileDevice(navigator.userAgent))
        return (
            <div className="flex h-screen justify-center">
                <Blocked />
            </div>
        )
    return (
        <html lang="en">
            <body>
                <ProgressBarProvider>
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
                </ProgressBarProvider>
            </body>
        </html>
    )
}

export default RootLayout

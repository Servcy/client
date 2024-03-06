"use client"

import Blocked from "@/components/Shared/blocked"
import SideBar from "@/components/Shared/sidebar"

import "@/styles/globals.css"

import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import Router from "next/router"

import { FC, PropsWithChildren, useEffect, useState } from "react"

import { SyncOutlined } from "@ant-design/icons"
import { googleLogout, GoogleOAuthProvider } from "@react-oauth/google"
import { Analytics } from "@vercel/analytics/react"
import { Spin } from "antd"
import { ThemeProvider, useTheme } from "next-themes"
import NProgress from "nprogress"
import toast, { Toaster } from "react-hot-toast"
import { mutate, SWRConfig } from "swr"

import { useUser, useWorkspace } from "@hooks/store"

import { StoreProvider } from "@contexts/StoreContext"

import InstanceLayout from "@layouts/instance-layout"

import { SWR_CONFIG } from "@constants/swr-config"
import { THEMES } from "@constants/themes"

import { isMobileDevice } from "@/utils/Shared"

// dynamic imports
const StoreWrapper = dynamic(() => import("@wrappers/StoreWrapper"), { ssr: false })
const PostHogProvider = dynamic(() => import("@contexts/PosthogContext"), { ssr: false })
const CrispWrapper = dynamic(() => import("@wrappers/CrispWrapper"), { ssr: false })

// nprogress
NProgress.configure({ showSpinner: false })
Router.events.on("routeChangeStart", NProgress.start)
Router.events.on("routeChangeError", NProgress.done)
Router.events.on("routeChangeComplete", NProgress.done)

const RootLayout: FC<PropsWithChildren> = function ({ children }) {
    const {
        currentUser,
        membership: { currentProjectRole, currentWorkspaceRole },
        logOut,
    } = useUser()
    const { currentWorkspace } = useWorkspace()

    return (
        <html lang="en">
            <body>
                <Toaster />
                <GoogleOAuthProvider clientId={process.env["NEXT_PUBLIC_GOOGLE_SSO_CLIENT_ID"] ?? ""}>
                    <StoreProvider>
                        <ThemeProvider themes={THEMES} defaultTheme="system">
                            <InstanceLayout>
                                <StoreWrapper>
                                    <CrispWrapper user={currentUser}>
                                        <PostHogProvider
                                            user={currentUser}
                                            currentWorkspaceId={currentWorkspace?.id}
                                            workspaceRole={currentWorkspaceRole}
                                            projectRole={currentProjectRole}
                                        >
                                            <SWRConfig value={SWR_CONFIG}>
                                                <LayoutWrapper logOut={logOut}>
                                                    {children}
                                                    <Analytics />
                                                </LayoutWrapper>
                                            </SWRConfig>
                                        </PostHogProvider>
                                    </CrispWrapper>
                                </StoreWrapper>
                            </InstanceLayout>
                        </ThemeProvider>
                    </StoreProvider>
                </GoogleOAuthProvider>
            </body>
        </html>
    )
}

const LayoutWrapper: FC<{ children: React.ReactNode; logOut: () => Promise<void> }> = function ({ children, logOut }) {
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const { setTheme } = useTheme()
    const logOutHandler = async () => {
        try {
            setLoading(true)
            await logOut()
                .then(() => {
                    mutate("CURRENT_USER_DETAILS", null)
                    setTheme("system")
                    router.push("/login")
                })
                .catch(() => toast.error("Failed to sign out. Please try again."))
            googleLogout()
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }, [])

    if (loading)
        return (
            <div className="flex h-screen justify-center">
                <Spin
                    className="order-2 m-auto"
                    size="large"
                    indicator={
                        <SyncOutlined
                            spin
                            style={{
                                color: "#26542F",
                            }}
                        />
                    }
                />
            </div>
        )
    if (isMobileDevice(navigator.userAgent))
        return (
            <div className="flex h-screen justify-center">
                <Blocked />
            </div>
        )
    return (
        <div className="flex">
            {children}
            <div className="order-1">
                <SideBar logOut={logOutHandler} />
            </div>
        </div>
    )
}

export default RootLayout

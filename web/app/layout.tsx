"use client"

import Blocked from "@components/shared/blocked"
import SideBar from "@components/shared/sidebar"

import "@styles/global.css"

import { AppProps } from "next/app"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import Router from "next/router"

import { FC, useEffect, useState } from "react"

import type { NextPageWithWrapper } from "@/types/index"
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

import { SWR_CONFIG } from "@constants/swr-config"
import { THEMES } from "@constants/themes"

import { isMobileDevice } from "@helpers/common.helper"

// dynamic imports
const StoreWrapper = dynamic(() => import("@wrappers/StoreWrapper"), { ssr: false })
const PostHogProvider = dynamic(() => import("@contexts/PosthogContext"), { ssr: false })
const CrispWrapper = dynamic(() => import("@wrappers/CrispWrapper"), { ssr: false })

// nprogress
NProgress.configure({ showSpinner: false })
Router.events.on("routeChangeStart", NProgress.start)
Router.events.on("routeChangeError", NProgress.done)
Router.events.on("routeChangeComplete", NProgress.done)

type AppRootLayout = AppProps & {
    Component: NextPageWithWrapper
}

function RootLayout({ Component, pageProps }: AppRootLayout) {
    const {
        currentUser,
        membership: { currentProjectRole, currentWorkspaceRole },
        logOut,
    } = useUser()
    const { currentWorkspace } = useWorkspace()
    // For mobile devices web app is not supported
    if (isMobileDevice(navigator.userAgent))
        return (
            <div className="flex h-screen justify-center">
                <Blocked />
            </div>
        )
    const wrappedComponent = Component.hasWrapper ? (
        <Component {...pageProps} />
    ) : (
        <LayoutWrapper logOut={logOut}>
            <Component {...pageProps} />
        </LayoutWrapper>
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
                                        <SWRConfig value={SWR_CONFIG}>{wrappedComponent}</SWRConfig>
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
    return (
        <div className="flex">
            <main className="order-2 flex-[1_0_16rem] overflow-y-scroll bg-servcy-gray p-3">{children}</main>
            <div className="order-1">
                <SideBar logOut={logOutHandler} />
            </div>
        </div>
    )
}

export default RootLayout

"use client"

import Head from "next/head"
import { useParams } from "next/navigation"
import Script from "next/script"

import Blocked from "@components/shared/blocked"

import "@styles/global.css"

import { FC, PropsWithChildren, Suspense } from "react"

import { GoogleOAuthProvider } from "@react-oauth/google"
import { Analytics } from "@vercel/analytics/react"
import { ThemeProvider } from "next-themes"
import { Toaster } from "react-hot-toast"
import { SWRConfig } from "swr"

import { useUser, useWorkspace } from "@hooks/store"

import PostHogProvider from "@contexts/external/PosthogContext"
import ProgressBarProvider from "@contexts/external/ProgressBarProvider"
import { StoreProvider } from "@contexts/StoreContext"

import { SWR_CONFIG } from "@constants/swr-config"
import { THEMES } from "@constants/themes"

import StoreWrapper from "@wrappers/store/StoreWrapper"

import { isMobileDevice } from "@helpers/common.helper"

const RootLayout: FC<PropsWithChildren> = function ({ children }) {
    const {
        currentUser,
        membership: { currentProjectRole, currentWorkspaceRole },
    } = useUser()
    const { workspaceSlug } = useParams()
    const { currentWorkspace } = useWorkspace()
    if (typeof window !== "undefined" && navigator && isMobileDevice(navigator.userAgent)) {
        return (
            <div className="flex h-screen justify-center">
                <Blocked />
            </div>
        )
    }
    return (
        <html lang="en">
            <Head>
                <title>{workspaceSlug ?? "Servcy Portal"}</title>
            </Head>
            <Script type="text/javascript" id="clarity-microsoft">
                {`(function(c,l,a,r,i,t,y){
                        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                    })(window, document, "clarity", "script", "lca3vb6j6d");`}
            </Script>
            <Script type="text/javascript" id="">
                {`window.fwSettings={'widget_id':1060000001144};!function(){if("function"!=typeof window.FreshworksWidget){var n=function(){n.q.push(arguments)};n.q=[],window.FreshworksWidget=n}}();FreshworksWidget('hide', 'launcher');FreshworksWidget('hide', 'ticketForm', ['product_id']);`}
            </Script>
            <Script
                type="text/javascript"
                src="https://ind-widget.freshworks.com/widgets/1060000001144.js"
                async
                defer
            />
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <body>
                <ProgressBarProvider>
                    <Toaster
                        toastOptions={{
                            style: {
                                background: "#333",
                                color: "#fff",
                            },
                            position: "bottom-right",
                            success: {
                                icon: "🎉",
                                duration: 3000,
                            },
                            error: {
                                icon: "🚧",
                                duration: 3000,
                            },
                        }}
                    />
                    <Analytics />
                    <GoogleOAuthProvider clientId={process.env["NEXT_PUBLIC_GOOGLE_SSO_CLIENT_ID"] ?? ""}>
                        <StoreProvider>
                            <ThemeProvider themes={THEMES} defaultTheme="system">
                                <Suspense>
                                    <StoreWrapper>
                                        <PostHogProvider
                                            user={currentUser}
                                            currentWorkspaceId={currentWorkspace?.id}
                                            workspaceRole={currentWorkspaceRole}
                                            projectRole={currentProjectRole}
                                        >
                                            <SWRConfig value={SWR_CONFIG}>{children}</SWRConfig>
                                        </PostHogProvider>
                                    </StoreWrapper>
                                </Suspense>
                            </ThemeProvider>
                        </StoreProvider>
                    </GoogleOAuthProvider>
                </ProgressBarProvider>
            </body>
        </html>
    )
}

export default RootLayout

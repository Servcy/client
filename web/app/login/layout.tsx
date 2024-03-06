"use client"

import { FC, PropsWithChildren, useEffect, useState } from "react"

import { SyncOutlined } from "@ant-design/icons"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { Analytics } from "@vercel/analytics/react"
import { Spin } from "antd"
import { Toaster } from "react-hot-toast"

import Blocked from "@components/shared/blocked"

import "@/styles/globals.css"

import { isMobileDevice } from "@helpers/common.helper"

const LoginLayout: FC<PropsWithChildren> = function ({ children }) {
    return (
        <html lang="en">
            <body>
                <Toaster />
                <GoogleOAuthProvider clientId={process.env["NEXT_PUBLIC_GOOGLE_SSO_CLIENT_ID"] ?? ""}>
                    <LayoutWrapper>
                        {children}
                        <Analytics />
                    </LayoutWrapper>
                </GoogleOAuthProvider>
            </body>
        </html>
    )
}

const LayoutWrapper: FC<PropsWithChildren> = function ({ children }) {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 500)
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
    return <div className="flex">{children}</div>
}

export default LoginLayout

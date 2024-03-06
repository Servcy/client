"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { integrationOauth as integrationOauthApi } from "@/apis/integration"
import { SyncOutlined } from "@ant-design/icons"
import { Spin } from "antd"
import toast from "react-hot-toast"
import { getQueryParams } from "@/utils/Shared"
import { capitalizeFirstLetter } from "@/utils/Shared/formatters"

export default function IntegrationOauth(): JSX.Element {
    const params = useParams()
    const router = useRouter()
    const { slug } = params

    useEffect(() => {
        if (typeof slug !== "string") return
        const oauthParams: Record<string, string> = getQueryParams(window.location.search)
        if (!oauthParams["code"]) {
            // try hash to support legacy oauth
            const hashParams = new URLSearchParams(window.location.hash.substring(1))
            const token = hashParams.get("token")
            if (token) {
                oauthParams["code"] = token
            }
        }
        integrationOauthApi(oauthParams, slug)
            .then((response) => {
                toast.success(`${capitalizeFirstLetter(slug)} connected successfully!`)
                if (response?.results !== "null") {
                    const redirect_uri =
                        JSON.parse(response?.results)?.redirect_uri ||
                        `/integrations?openConfigurationModal=1&selectedIntegration=${slug}`
                    if (redirect_uri.startsWith("https")) {
                        window.open(`/integrations?openConfigurationModal=1&selectedIntegration=${slug}`, "_blank")
                        setTimeout(() => {
                            router.push(redirect_uri)
                        }, 1000)
                    } else router.push(redirect_uri)
                } else router.push(`/integrations?openConfigurationModal=1&selectedIntegration=${slug}`)
            })
            .catch((error: any) => {
                toast.error(error?.response?.data?.detail || "Something went wrong!")
                router.push("/integrations")
            })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <main className="order-2 h-screen w-full bg-servcy-white">
            <div className="flex h-full w-full flex-col items-center justify-center">
                <Spin
                    className="m-auto"
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
        </main>
    )
}

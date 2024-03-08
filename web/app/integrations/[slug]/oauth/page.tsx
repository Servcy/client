"use client"

import { useParams, useRouter } from "next/navigation"

import { useEffect } from "react"

import { Spinner } from "@servcy/ui"

import toast from "react-hot-toast"

import { getQueryParams } from "@helpers/common.helper"
import { capitalizeFirstLetter } from "@helpers/formatter.helper"
import  IntegrationService from "@services/integration.service"

const integration_service = new IntegrationService()

export default function IntegrationOauth(): JSX.Element {
    const params = useParams()
    const router = useRouter()
    const slug = params?.["slug"]

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
        integration_service.integrationOauth(oauthParams, slug)
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
    }, [])

    return (
        <div className="grid h-screen w-full place-items-center">
            <Spinner />
        </div>
    )
}

import { useParams, useRouter } from "next/navigation"

import { useCallback, useState } from "react"

import { useUser } from "@hooks/store"

import { IUser, IUserSettings } from "@servcy/types"

type UseLoginRedirectionProps = {
    error: any | null
    isRedirecting: boolean
    handleRedirection: () => Promise<void>
}

const useLoginRedirection = (): UseLoginRedirectionProps => {
    // states
    const [isRedirecting, setIsRedirecting] = useState(true)
    const [error, setError] = useState<any | null>(null)

    const router = useRouter()
    const params = useParams()
    const { nextUrl } = params
    // mobx store
    const { fetchCurrentUser, fetchCurrentUserSettings } = useUser()

    const isValidURL = (url: string): boolean => {
        const disallowedSchemes = /^(https?|ftp):\/\//i
        return !disallowedSchemes.test(url)
    }

    const handleLoginRedirection = useCallback(
        async (user: IUser) => {
            try {
                // if the user is not onboarded, redirect them to the onboarding page
                if (!user.is_onboarded) {
                    router.push("/onboarding")
                    return
                }
                // if nextUrl is provided, redirect the user to that url
                if (nextUrl) {
                    if (isValidURL(nextUrl.toString())) {
                        router.push(nextUrl.toString())
                        return
                    } else {
                        router.push("/")
                        return
                    }
                }

                // Fetch the current user settings
                const userSettings: IUserSettings = await fetchCurrentUserSettings()

                // Extract workspace details
                const workspaceSlug =
                    userSettings?.workspace?.last_workspace_slug || userSettings?.workspace?.fallback_workspace_slug

                // Redirect based on workspace details or to the root path
                if (workspaceSlug) router.push(`/${workspaceSlug}`)
                else router.push("/")
            } catch (error) {
                setError(error)
            }
        },
        [fetchCurrentUserSettings, router, nextUrl]
    )

    const updateUserInfo = useCallback(async () => {
        setIsRedirecting(true)
        await fetchCurrentUser()
            .then(async (user) => {
                await handleLoginRedirection(user)
                    .catch((err) => setError(err))
                    .finally(() => setIsRedirecting(false))
            })
            .catch((err) => {
                setError(err)
                setIsRedirecting(false)
            })
    }, [fetchCurrentUser, handleLoginRedirection])

    return {
        error,
        isRedirecting,
        handleRedirection: updateUserInfo,
    }
}

export default useLoginRedirection

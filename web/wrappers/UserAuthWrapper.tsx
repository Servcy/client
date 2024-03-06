import { useRouter } from "next/router"

import { FC, ReactNode } from "react"

import { observer } from "mobx-react-lite"
import useSWR from "swr"

import { useUser, useWorkspace } from "@hooks/store"

import { Spinner } from "@servcy/ui"

export interface IUserAuthWrapper {
    children: ReactNode
}

const UserAuthWrapper: FC<IUserAuthWrapper> = observer((props) => {
    const { children } = props
    // store hooks
    const { currentUser, currentUserError, fetchCurrentUser, fetchCurrentUserSettings } = useUser()
    const { fetchWorkspaces } = useWorkspace()
    // router
    const router = useRouter()
    // fetching user information
    useSWR("CURRENT_USER_DETAILS", () => fetchCurrentUser(), {
        shouldRetryOnError: false,
    })
    // fetching user settings
    useSWR("CURRENT_USER_SETTINGS", () => fetchCurrentUserSettings(), {
        shouldRetryOnError: false,
    })
    // fetching all workspaces
    useSWR("USER_WORKSPACES_LIST", () => fetchWorkspaces(), {
        shouldRetryOnError: false,
    })

    if (!currentUser && !currentUserError) {
        return (
            <div className="grid h-screen place-items-center bg-custom-background-100 p-4">
                <div className="flex flex-col items-center gap-3 text-center">
                    <Spinner />
                </div>
            </div>
        )
    }

    if (currentUserError) {
        const redirectTo = router.asPath
        router.push(`/?nextUrl=${redirectTo}`)
        return null
    }

    return <>{children}</>
})

export default UserAuthWrapper

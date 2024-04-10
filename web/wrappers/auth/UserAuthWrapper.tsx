import { usePathname, useRouter } from "next/navigation"

import { FC, ReactNode, useEffect } from "react"

import { observer } from "mobx-react-lite"
import useSWR from "swr"

import { useUser, useWorkspace } from "@hooks/store"

import { WorkspaceService } from "@services/workspace.service"

import { Spinner } from "@servcy/ui"

const workspaceService = new WorkspaceService()

export interface IUserAuthWrapper {
    children: ReactNode
}

const UserAuthWrapper: FC<IUserAuthWrapper> = observer((props) => {
    const { children } = props
    const { currentUser, currentUserError, currentUserLoader, fetchCurrentUser, fetchCurrentUserSettings } = useUser()
    const { fetchWorkspaces } = useWorkspace()
    const router = useRouter()
    const pathname = usePathname()

    // fetching user information
    useSWR(
        "CURRENT_USER_DETAILS",
        () => {
            try {
                fetchCurrentUser()
            } catch {
                router.push("/login")
            }
        },
        {
            shouldRetryOnError: false,
        }
    )
    // fetching user settings
    useSWR("CURRENT_USER_SETTINGS", () => fetchCurrentUserSettings(), {
        shouldRetryOnError: false,
        revalidateOnFocus: false,
    })
    // fetching all workspaces
    useSWR("USER_WORKSPACES_LIST", () => fetchWorkspaces(), {
        shouldRetryOnError: false,
        revalidateOnFocus: false,
    })

    useEffect(() => {
        const handleWorkSpaceRedirection = async () => {
            workspaceService.userWorkspaces().then(async (userWorkspaces) => {
                if (!currentUser) return
                const firstWorkspace = Object.values(userWorkspaces ?? {})?.[0]
                const lastActiveWorkspace = userWorkspaces.find(
                    (workspace) => workspace.id === currentUser?.last_workspace_id
                )
                if (lastActiveWorkspace) {
                    router.push(`/${lastActiveWorkspace.slug}`)
                    return
                }
                if (firstWorkspace) {
                    router.push(`/${firstWorkspace.slug}`)
                    return
                }
                router.push(`/profile`)
                return
            })
        }

        const handleUserRouteAuthentication = async () => {
            if (currentUser && currentUser.is_active && currentUser.is_onboarded && pathname === "/onboarding") {
                handleWorkSpaceRedirection()
                return
            }
            if (currentUser && currentUser.is_active && !currentUser.is_onboarded && pathname !== "/onboarding") {
                router.push("/onboarding")
                return
            }
            return
        }

        if (currentUser && !currentUserLoader) handleUserRouteAuthentication()
    }, [currentUser, currentUserLoader])

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
        const redirectTo = `/login?nextUrl=${encodeURIComponent(pathname)}`
        router.replace(redirectTo)
        return null
    }

    return <>{children}</>
})

export default UserAuthWrapper

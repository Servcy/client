import { useRouter, usePathname } from "next/navigation"

import { useEffect } from "react"

import { WorkspaceService } from "@services/workspace.service"

import { IUser } from "@servcy/types"

const workspaceService = new WorkspaceService()

type Props = {
    user: IUser | null
    isUserLoading: boolean
}

const useUserAuth = (props: Props) => {
    const { user, isUserLoading } = props
    // router
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const handleWorkSpaceRedirection = async () => {
            workspaceService.userWorkspaces().then(async (userWorkspaces) => {
                if (!user) return
                const firstWorkspace = Object.values(userWorkspaces ?? {})?.[0]
                const lastActiveWorkspace = userWorkspaces.find((workspace) => workspace.id === user?.last_workspace_id)
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
            if (user && user.is_active && user.is_onboarded && pathname === "/onboarding") {
                handleWorkSpaceRedirection()
                return
            }
            if (user && user.is_active && !user.is_onboarded && pathname !== "/onboarding") {
                router.push("/onboarding")
                return
            }
            return
        }

        if (user && !isUserLoading) handleUserRouteAuthentication()
    }, [user, isUserLoading, router])

    return {}
}

export default useUserAuth

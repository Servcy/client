import { usePathname, useParams } from "next/navigation"

import { FC, ReactNode, useEffect, useState } from "react"

import posthog from "posthog-js"
import { PostHogProvider as PHProvider } from "posthog-js/react"

import { GROUP_WORKSPACE } from "@constants/event-tracker"

import { getUserRole } from "@helpers/user.helper"

import { IUser } from "@servcy/types"

export interface IPosthogWrapper {
    children: ReactNode
    user: IUser | null
    currentWorkspaceId: string | undefined
    workspaceRole: number | undefined
    projectRole: number | undefined
}

const PostHogProvider: FC<IPosthogWrapper> = (props) => {
    const { children, user, workspaceRole, currentWorkspaceId, projectRole } = props
    const pathame = usePathname()
    const params = useParams()
    // states
    const [lastWorkspaceId, setLastWorkspaceId] = useState(currentWorkspaceId)

    useEffect(() => {
        if (user) {
            // Identify sends an event, so you want may want to limit how often you call it
            posthog?.identify(user.email, {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                use_case: user.use_case,
                workspace_role: workspaceRole ? getUserRole(workspaceRole) : undefined,
                project_role: projectRole ? getUserRole(projectRole) : undefined,
            })
        }
    }, [user, workspaceRole, projectRole])

    useEffect(() => {}, [])

    useEffect(() => {
        // Join workspace group on workspace change
        if (lastWorkspaceId !== currentWorkspaceId && currentWorkspaceId && user) {
            setLastWorkspaceId(currentWorkspaceId)
            posthog?.identify(user.email)
            posthog?.group(GROUP_WORKSPACE, currentWorkspaceId)
        }
    }, [currentWorkspaceId, lastWorkspaceId, user])

    useEffect(() => {
        const handleRouteChange = () => {
            posthog?.capture("$pageview")
        }
        posthog.init(process.env["NEXT_PUBLIC_POSTHOG_ID"] ?? "", {
            api_host: process.env["NEXT_PUBLIC_POSTHOG_HOST"],
            autocapture: false,
            capture_pageview: false,
        })
        handleRouteChange()
    }, [pathame, params])

    return <PHProvider client={posthog}>{children}</PHProvider>
}

export default PostHogProvider

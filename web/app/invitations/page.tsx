"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { useState } from "react"

import { CheckCircle2, Mails } from "lucide-react"
import { observer } from "mobx-react-lite"
import emptyInvitation from "public/empty-state/invitation.svg"
import toast from "react-hot-toast"
import useSWR, { mutate } from "swr"

import { EmptyState } from "@components/common"
import { PageHead } from "@components/core"

import { useEventTracker, useUser } from "@hooks/store"

import { MEMBER_ACCEPTED } from "@constants/event-tracker"
import { ROLES } from "@constants/iam"

import { UserService } from "@services/user.service"
import { WorkspaceService } from "@services/workspace.service"

import { DefaultHeader } from "@components/headers"
import DefaultWrapper from "@wrappers/DefaultWrapper"

import { truncateText } from "@helpers/string.helper"
import { getUserRole } from "@helpers/user.helper"

import type { IWorkspaceMemberInvitation } from "@servcy/types"
import { Button } from "@servcy/ui"

const workspaceService = new WorkspaceService()
const userService = new UserService()

const UserInvitationsPage = observer(() => {
    // states
    const [invitationsRespond, setInvitationsRespond] = useState<string[]>([])
    const [isJoiningWorkspaces, setIsJoiningWorkspaces] = useState(false)
    // store hooks
    const { captureEvent, joinWorkspaceMetricGroup } = useEventTracker()
    const { currentUserSettings } = useUser()

    const router = useRouter()

    const { data } = useSWR("USER_WORKSPACE_INVITATIONS", () =>
        workspaceService.userWorkspaceInvitations()
    )

    const invitations = data?.results ?? []

    const redirectWorkspaceSlug =
        currentUserSettings?.workspace?.last_workspace_slug ||
        currentUserSettings?.workspace?.fallback_workspace_slug ||
        ""

    const handleInvitation = (workspace_invitation: IWorkspaceMemberInvitation, action: "accepted" | "withdraw") => {
        if (action === "accepted") {
            setInvitationsRespond((prevData) => [...prevData, workspace_invitation.id])
        } else if (action === "withdraw") {
            setInvitationsRespond((prevData) => prevData.filter((item: string) => item !== workspace_invitation.id))
        }
    }

    const submitInvitations = () => {
        if (invitationsRespond.length === 0) {
            toast.error("Please select at least one invitation.")
            return
        }

        setIsJoiningWorkspaces(true)

        workspaceService
            .joinWorkspaces({ invitations: invitationsRespond })
            .then(() => {
                mutate("USER_WORKSPACES")
                const firstInviteId = invitationsRespond[0]
                const invitation = invitations?.find((i) => i.id === firstInviteId)
                const redirectWorkspace = invitations?.find((i) => i.id === firstInviteId)?.workspace
                joinWorkspaceMetricGroup(redirectWorkspace?.id)
                captureEvent(MEMBER_ACCEPTED, {
                    member_id: invitation?.id,
                    role: getUserRole(invitation?.role!),
                    project_id: undefined,
                    accepted_from: "App",
                    state: "SUCCESS",
                    element: "Workspace invitations page",
                })
                userService
                    .updateUser({ last_workspace_id: redirectWorkspace?.id })
                    .then(() => {
                        setIsJoiningWorkspaces(false)
                        router.push(`/${redirectWorkspace?.slug}`)
                    })
                    .catch(() => {
                        toast.error("Something went wrong, Please try again.")
                        setIsJoiningWorkspaces(false)
                    })
            })
            .catch(() => {
                captureEvent(MEMBER_ACCEPTED, {
                    project_id: undefined,
                    accepted_from: "App",
                    state: "FAILED",
                    element: "Workspace invitations page",
                })
                toast.error("Something went wrong, Please try again.")
                setIsJoiningWorkspaces(false)
            })
    }

    return (
        <DefaultWrapper
            header={<DefaultHeader title="Invitations" icon={<Mails className="h-4 w-4 text-custom-text-300" />} />}
        >
            <PageHead title="Invitations" />
            <div className="flex h-full flex-col gap-y-2 overflow-hidden sm:flex-row sm:gap-y-0">
                {invitations ? (
                    invitations.length > 0 ? (
                        <div className="relative flex h-full justify-center px-12 pb-8 sm:items-center sm:justify-start w-full">
                            <div className="w-full space-y-10">
                                <h5 className="text-lg">We see that someone has invited you to</h5>
                                <h4 className="text-2xl font-semibold">Join a workspace</h4>
                                <div className="max-h-[37vh] space-y-4 overflow-y-auto md:w-3/5">
                                    {invitations.map((invitation) => {
                                        const isSelected = invitationsRespond.includes(invitation.id)

                                        return (
                                            <div
                                                key={invitation.id}
                                                className={`flex cursor-pointer items-center gap-2 rounded border px-3.5 py-5 ${
                                                    isSelected
                                                        ? "border-custom-primary-100"
                                                        : "border-custom-border-200 hover:bg-custom-background-80"
                                                }`}
                                                onClick={() =>
                                                    handleInvitation(
                                                        invitation,
                                                        isSelected ? "withdraw" : "accepted"
                                                    )
                                                }
                                            >
                                                <div className="flex-shrink-0">
                                                    <div className="grid h-9 w-9 place-items-center rounded">
                                                        {invitation.workspace.logo &&
                                                        invitation.workspace.logo.trim() !== "" ? (
                                                            <img
                                                                src={invitation.workspace.logo}
                                                                height="100%"
                                                                width="100%"
                                                                className="rounded"
                                                                alt={invitation.workspace.name}
                                                            />
                                                        ) : (
                                                            <span className="grid h-9 w-9 place-items-center rounded bg-gray-700 px-3 py-1.5 uppercase text-white">
                                                                {invitation.workspace.name[0]}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-sm font-medium">
                                                        {truncateText(invitation.workspace.name, 30)}
                                                    </div>
                                                    <p className="text-xs text-custom-text-200">
                                                        {ROLES[invitation.role]}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`flex-shrink-0 ${isSelected ? "text-custom-primary-100" : "text-custom-text-200"}`}
                                                >
                                                    <CheckCircle2 className="h-5 w-5" />
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        size="md"
                                        onClick={submitInvitations}
                                        disabled={isJoiningWorkspaces || invitationsRespond.length === 0}
                                        loading={isJoiningWorkspaces}
                                    >
                                        Accept & Join
                                    </Button>
                                    <Link href={`/${redirectWorkspaceSlug}`}>
                                        <span>
                                            <Button variant="neutral-primary" size="md">
                                                Go Home
                                            </Button>
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid h-full w-full place-items-center">
                            <EmptyState
                                title="No pending invites"
                                description="You can see here if someone invites you to a workspace."
                                image={emptyInvitation}
                            />
                        </div>
                    )
                ) : null}
            </div>
        </DefaultWrapper>
    )
})

export default UserInvitationsPage

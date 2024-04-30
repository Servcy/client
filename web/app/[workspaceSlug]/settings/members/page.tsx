"use client"

import { useParams } from "next/navigation"

import { useState } from "react"

import { Search } from "lucide-react"
import { observer } from "mobx-react-lite"
import toast from "react-hot-toast"

import { PageHead } from "@components/core"
import { WorkspaceSettingHeader } from "@components/headers"
import { SendWorkspaceInvitationModal, WorkspaceMembersList } from "@components/workspace"

import { useApplication, useBilling, useEventTracker, useMember, useUser, useWorkspace } from "@hooks/store"

import { MEMBER_INVITED } from "@constants/event-tracker"
import { ERoles } from "@constants/iam"

import { AppWrapper } from "@wrappers/app"
import { WorkspaceSettingWrapper } from "@wrappers/settings"

import { getUserRole } from "@helpers/user.helper"

import type { IWorkspaceBulkInviteFormData } from "@servcy/types"
import { Button } from "@servcy/ui"

const WorkspaceMembersSettingsPage = observer(() => {
    // states
    const [inviteModal, setInviteModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState<string>("")
    const { workspaceSlug } = useParams()
    // store hooks
    const { captureEvent } = useEventTracker()
    const {
        commandPalette: { toggleUpgradePlanModal },
    } = useApplication()
    const {
        membership: { currentWorkspaceRole },
    } = useUser()
    const {
        workspace: { inviteMembersToWorkspace, totalWorkspaceMembers },
    } = useMember()
    const { currentWorkspace } = useWorkspace()
    const { workspaceInvitationLimit } = useBilling()
    const handleWorkspaceInvite = (data: IWorkspaceBulkInviteFormData) => {
        if (!workspaceSlug) return

        return inviteMembersToWorkspace(workspaceSlug.toString(), data)
            .then(() => {
                setInviteModal(false)
                captureEvent(MEMBER_INVITED, {
                    emails: [
                        ...data.emails.map((email) => ({
                            email: email.email,
                            role: getUserRole(email.role),
                        })),
                    ],
                    project_id: undefined,
                    state: "SUCCESS",
                    element: "Workspace settings member page",
                })
            })
            .catch(() => {
                captureEvent(MEMBER_INVITED, {
                    emails: [
                        ...data.emails.map((email) => ({
                            email: email.email,
                            role: getUserRole(email.role),
                        })),
                    ],
                    project_id: undefined,
                    state: "FAILED",
                    element: "Workspace settings member page",
                })
                toast.error("Please try again later")
            })
    }

    // derived values
    const hasAddMemberPermission = currentWorkspaceRole !== undefined && currentWorkspaceRole >= ERoles.MEMBER
    const pageTitle = currentWorkspace?.name ? `${currentWorkspace.name} - Members` : undefined

    return (
        <AppWrapper header={<WorkspaceSettingHeader title="Members Settings" />}>
            <WorkspaceSettingWrapper>
                <PageHead title={pageTitle} />
                <SendWorkspaceInvitationModal
                    isOpen={inviteModal}
                    onClose={() => setInviteModal(false)}
                    onSubmit={handleWorkspaceInvite}
                />
                <section className="w-full overflow-y-auto py-8 pr-9">
                    <div className="flex items-center justify-between gap-4 border-b border-custom-border-100 py-3.5">
                        <h4 className="text-xl font-medium">Members</h4>
                        <div className="ml-auto flex items-center gap-1.5 rounded-md border border-custom-border-200 bg-custom-background-100 px-2.5 py-1.5">
                            <Search className="h-3.5 w-3.5 text-custom-text-400" />
                            <input
                                className="w-full max-w-[234px] border-none bg-transparent text-sm outline-none placeholder:text-custom-text-400"
                                placeholder="Search..."
                                value={searchQuery}
                                autoFocus
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        {hasAddMemberPermission && (
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => {
                                    const seatsRemaining = workspaceInvitationLimit - totalWorkspaceMembers
                                    if (seatsRemaining <= 0) {
                                        toggleUpgradePlanModal(true)
                                    }
                                    setInviteModal(true)
                                }}
                            >
                                Add member
                            </Button>
                        )}
                    </div>
                    <WorkspaceMembersList searchQuery={searchQuery} />
                </section>
            </WorkspaceSettingWrapper>
        </AppWrapper>
    )
})

export default WorkspaceMembersSettingsPage

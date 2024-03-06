"use client"

import { useRouter } from "next/router"

import { useState } from "react"

import { NextPageWithLayout } from "@/types/index"
import { Search } from "lucide-react"
import { observer } from "mobx-react-lite"
import toast from "react-hot-toast"

import { PageHead } from "@components/core"
import { SendWorkspaceInvitationModal, WorkspaceMembersList } from "@components/workspace"

import { useEventTracker, useMember, useUser, useWorkspace } from "@hooks/store"

import { MEMBER_INVITED } from "@constants/event-tracker"
import { EUserWorkspaceRoles } from "@constants/workspace"

import { getUserRole } from "@helpers/user.helper"

import { IWorkspaceBulkInviteFormData } from "@servcy/types"
import { Button } from "@servcy/ui"

const WorkspaceMembersSettingsPage: NextPageWithLayout = observer(() => {
    // states
    const [inviteModal, setInviteModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState<string>("")
    // router
    const router = useRouter()
    const { workspaceSlug } = router.query
    // store hooks
    const { captureEvent } = useEventTracker()
    const {
        membership: { currentWorkspaceRole },
    } = useUser()
    const {
        workspace: { inviteMembersToWorkspace },
    } = useMember()
    const { currentWorkspace } = useWorkspace()

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
                toast.success("Invitations sent successfully.")
            })
            .catch((err) => {
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
                toast.error(`${err.error ?? "Something went wrong. Please try again."}`)
            })
    }

    // derived values
    const hasAddMemberPermission =
        currentWorkspaceRole && [EUserWorkspaceRoles.ADMIN, EUserWorkspaceRoles.MEMBER].includes(currentWorkspaceRole)
    const pageTitle = currentWorkspace?.name ? `${currentWorkspace.name} - Members` : undefined

    return (
        <>
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
                        <Button variant="primary" size="sm" onClick={() => setInviteModal(true)}>
                            Add member
                        </Button>
                    )}
                </div>
                <WorkspaceMembersList searchQuery={searchQuery} />
            </section>
        </>
    )
})

export default WorkspaceMembersSettingsPage

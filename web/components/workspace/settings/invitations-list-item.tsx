import { useParams } from "next/navigation"

import { FC, useState } from "react"

import { ChevronDown, XCircle } from "lucide-react"
import { observer } from "mobx-react-lite"
import toast from "react-hot-toast"

import { ConfirmWorkspaceMemberRemove } from "@components/workspace"

import { useMember, useUser } from "@hooks/store"

import { ERoles, ROLES } from "@constants/iam"

import { CustomSelect, Tooltip } from "@servcy/ui"

type Props = {
    invitationId: string
}

export const WorkspaceInvitationsListItem: FC<Props> = observer((props) => {
    const { invitationId } = props
    // states
    const [removeMemberModal, setRemoveMemberModal] = useState(false)
    const { workspaceSlug } = useParams()
    // store hooks
    const {
        membership: { currentWorkspaceMemberInfo, currentWorkspaceRole },
    } = useUser()
    const {
        workspace: { updateMemberInvitation, deleteMemberInvitation, getWorkspaceInvitationDetails },
    } = useMember()

    // derived values
    const invitationDetails = getWorkspaceInvitationDetails(invitationId)

    const handleRemoveInvitation = async () => {
        if (!workspaceSlug || !invitationDetails) return

        await deleteMemberInvitation(workspaceSlug.toString(), invitationDetails.id)
            .then(() => {
                toast.success("Invitation removed successfully.")
            })
            .catch((err) => toast.error(err?.error || "Something went wrong. Please try again."))
    }

    if (!invitationDetails) return null

    // is the current logged in user admin
    const isAdmin = currentWorkspaceRole === ERoles.ADMIN
    // role change access-
    // 1. user cannot change their own role
    // 2. only admin or member can change role
    // 3. user cannot change role of higher role
    const hasRoleChangeAccess = currentWorkspaceRole && [ERoles.ADMIN, ERoles.MEMBER].includes(currentWorkspaceRole)

    if (!currentWorkspaceMemberInfo) return null

    return (
        <>
            <ConfirmWorkspaceMemberRemove
                isOpen={removeMemberModal}
                onClose={() => setRemoveMemberModal(false)}
                userDetails={{
                    id: invitationDetails.id,
                    display_name: `${invitationDetails.email}`,
                }}
                onSubmit={handleRemoveInvitation}
            />
            <div className="group flex items-center justify-between px-3 py-4 hover:bg-custom-background-90">
                <div className="flex items-center gap-x-4 gap-y-2">
                    <span className="relative flex h-10 w-10 items-center justify-center rounded bg-gray-700 p-4 capitalize text-white">
                        {(invitationDetails.email ?? "?")[0]}
                    </span>
                    <div>
                        <h4 className="cursor-default text-sm">{invitationDetails.email}</h4>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center justify-center rounded bg-yellow-500/20 px-2.5 py-1 text-center text-xs font-medium text-yellow-500">
                        <p>Pending</p>
                    </div>
                    <CustomSelect
                        customButton={
                            <div className="item-center flex gap-1 rounded px-2 py-0.5">
                                <span
                                    className={`flex items-center rounded text-xs font-medium ${
                                        hasRoleChangeAccess ? "" : "text-custom-sidebar-text-400"
                                    }`}
                                >
                                    {ROLES[invitationDetails.role]}
                                </span>
                                {hasRoleChangeAccess && (
                                    <span className="grid place-items-center">
                                        <ChevronDown className="h-3 w-3" />
                                    </span>
                                )}
                            </div>
                        }
                        value={invitationDetails.role}
                        onChange={(value: ERoles) => {
                            if (!workspaceSlug || !value) return

                            updateMemberInvitation(workspaceSlug.toString(), invitationDetails.id, {
                                role: value,
                            }).catch(() => {
                                toast.error("An error occurred while updating member role. Please try again.")
                            })
                        }}
                        disabled={!hasRoleChangeAccess}
                        placement="bottom-end"
                    >
                        {Object.keys(ROLES).map((key) => {
                            if (
                                currentWorkspaceRole &&
                                currentWorkspaceRole < ERoles.ADMIN &&
                                currentWorkspaceRole < parseInt(key)
                            )
                                return null

                            return (
                                <CustomSelect.Option key={key} value={parseInt(key, 10)}>
                                    <>{ROLES[parseInt(key) as keyof typeof ROLES]}</>
                                </CustomSelect.Option>
                            )
                        })}
                    </CustomSelect>
                    <Tooltip tooltipContent="Remove member" disabled={!isAdmin}>
                        <button
                            type="button"
                            onClick={() => setRemoveMemberModal(true)}
                            className={`pointer-events-none opacity-0 ${
                                isAdmin ? "group-hover:pointer-events-auto group-hover:opacity-100" : ""
                            }`}
                        >
                            <XCircle className="h-3.5 w-3.5 text-red-500" strokeWidth={2} />
                        </button>
                    </Tooltip>
                </div>
            </div>
        </>
    )
})

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

import { ChangeEvent, useState } from "react"

import { Briefcase, ChevronDown, Dot, Timer, XCircle } from "lucide-react"
import { observer } from "mobx-react-lite"
import toast from "react-hot-toast"

import { ConfirmProjectMemberRemove } from "@components/project"

import { useEventTracker, useMember, useProject, useUser } from "@hooks/store"

import { CURRENCY_CODES } from "@constants/billing"
import { PROJECT_MEMBER_LEAVE } from "@constants/event-tracker"
import { ERoles, ROLES } from "@constants/iam"

import { CustomSelect, Input, Tooltip } from "@servcy/ui"

type Props = {
    userId: string
}

export const ProjectMemberListItem: React.FC<Props> = observer((props) => {
    const { userId } = props
    // states
    const [removeMemberModal, setRemoveMemberModal] = useState(false)

    const router = useRouter()
    const { workspaceSlug, projectId } = useParams()
    // store hooks
    const {
        currentUser,
        membership: { currentProjectRole, currentWorkspaceRole, leaveProject },
    } = useUser()
    const { fetchProjects } = useProject()
    const {
        project: { removeMemberFromProject, getProjectMemberDetails, updateMember },
    } = useMember()
    const { captureEvent } = useEventTracker()

    // derived values
    const isAdmin = currentProjectRole === ERoles.ADMIN
    const userDetails = getProjectMemberDetails(userId)
    const handleRateChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (Number.isNaN(Number(e.target.value))) return
        if (!workspaceSlug || !projectId || !userDetails) return
        updateMember(workspaceSlug.toString(), projectId.toString(), userDetails.member.id, {
            role: userDetails.role ?? ERoles.MEMBER,
            rate: e.target.value,
            currency: userDetails.rate?.currency ?? "USD",
            per_hour_or_per_project: userDetails.rate?.per_hour_or_per_project ?? true,
        }).catch((err) => {
            const error = err.error
            const errorString = Array.isArray(error) ? error[0] : error
            toast.error(errorString ?? "An error occurred while updating member cost details. Please try again.")
        })
    }

    const handleRemove = async () => {
        if (!workspaceSlug || !projectId || !userDetails) return

        if (userDetails.member.id === currentUser?.id) {
            await leaveProject(workspaceSlug.toString(), projectId.toString())
                .then(async () => {
                    captureEvent(PROJECT_MEMBER_LEAVE, {
                        state: "SUCCESS",
                        element: "Project settings members page",
                    })
                    await fetchProjects(workspaceSlug.toString())
                    router.push(`/${workspaceSlug}/projects`)
                })
                .catch((err) => toast.error(err?.error || "Something went wrong. Please try again."))
        } else
            await removeMemberFromProject(workspaceSlug.toString(), projectId.toString(), userDetails.member.id).catch(
                (err) => toast.error(err?.error || "Something went wrong. Please try again.")
            )
    }

    if (!userDetails) return null

    return (
        <>
            <ConfirmProjectMemberRemove
                isOpen={removeMemberModal}
                onClose={() => setRemoveMemberModal(false)}
                data={userDetails.member}
                onSubmit={handleRemove}
            />
            <div className="group flex items-center justify-between px-3 py-4 hover:bg-custom-background-90">
                <div className="flex items-center gap-x-4 gap-y-2">
                    {userDetails.member.avatar && userDetails.member.avatar !== "" ? (
                        <Link href={`/${workspaceSlug}/profile/${userDetails.member.id}`}>
                            <span className="relative flex h-10 w-10 items-center justify-center rounded p-4 capitalize text-white">
                                <img
                                    src={userDetails.member.avatar}
                                    alt={userDetails.member.display_name || userDetails.member.email}
                                    className="absolute left-0 top-0 h-full w-full rounded object-cover"
                                />
                            </span>
                        </Link>
                    ) : (
                        <Link href={`/${workspaceSlug}/profile/${userDetails.id}`}>
                            <span className="relative flex h-10 w-10 items-center justify-center rounded bg-gray-700 p-4 capitalize text-white">
                                {(userDetails.member.display_name ?? userDetails.member.email ?? "?")[0]}
                            </span>
                        </Link>
                    )}

                    <div>
                        <Link href={`/${workspaceSlug}/profile/${userDetails.member.id}`}>
                            <span className="text-sm font-medium">
                                {userDetails.member.first_name} {userDetails.member.last_name}
                            </span>
                        </Link>
                        <div className="flex items-center">
                            <p className="text-xs text-custom-text-300">{userDetails.member.display_name}</p>
                            {isAdmin && (
                                <>
                                    <Dot height={16} width={16} className="text-custom-text-300" />
                                    <p className="text-xs text-custom-text-300">{userDetails.member.email}</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                    {!Number.isNaN(userDetails.rate?.rate) && currentWorkspaceRole === ERoles.ADMIN && (
                        <>
                            <Input
                                id={`project-member.${userDetails.member.id}.rate`}
                                type="text"
                                value={userDetails?.rate?.rate ?? ""}
                                placeholder="Member cost..."
                                onChange={handleRateChange}
                                className="focus:border-blue-400 w-28"
                            />
                            <CustomSelect
                                label={
                                    <div className="flex items-center gap-1">
                                        {userDetails?.rate?.currency ?? "USD"}
                                    </div>
                                }
                                value={userDetails?.rate?.currency ?? "USD"}
                                placement="bottom-start"
                                noChevron
                                onChange={(value: string) => {
                                    if (!workspaceSlug || !projectId) return
                                    updateMember(
                                        workspaceSlug.toString(),
                                        projectId.toString(),
                                        userDetails.member.id,
                                        {
                                            role: userDetails.role ?? ERoles.MEMBER,
                                            rate: userDetails.rate?.rate ?? "0",
                                            currency: value,
                                            per_hour_or_per_project: userDetails.rate?.per_hour_or_per_project ?? true,
                                        }
                                    ).catch((err) => {
                                        const error = err.error
                                        const errorString = Array.isArray(error) ? error[0] : error
                                        toast.error(
                                            errorString ??
                                                "An error occurred while updating member cost details. Please try again."
                                        )
                                    })
                                }}
                                input
                                optionsClassName="w-full"
                            >
                                {CURRENCY_CODES.map((currency) => (
                                    <CustomSelect.Option key={currency.code} value={currency.code}>
                                        <div className="flex items-center gap-2">
                                            <currency.icon className="h-3.5 w-3.5" />
                                            <div>{currency.code}</div>
                                        </div>
                                    </CustomSelect.Option>
                                ))}
                            </CustomSelect>
                            <CustomSelect
                                label={
                                    <div className="flex items-center gap-1">
                                        {userDetails?.rate?.per_hour_or_per_project ? (
                                            <Timer className="h-3 w-3" />
                                        ) : (
                                            <Briefcase className="h-3 w-3" />
                                        )}
                                        {userDetails?.rate?.per_hour_or_per_project ? "Per Hour" : "For Project"}
                                    </div>
                                }
                                value={userDetails?.rate?.per_hour_or_per_project ?? true}
                                placement="bottom-start"
                                noChevron
                                onChange={(value: boolean) => {
                                    if (!workspaceSlug || !projectId) return
                                    updateMember(
                                        workspaceSlug.toString(),
                                        projectId.toString(),
                                        userDetails.member.id,
                                        {
                                            role: userDetails.role ?? ERoles.MEMBER,
                                            rate: userDetails.rate?.rate ?? "0",
                                            per_hour_or_per_project: value,
                                            currency: userDetails.rate?.currency ?? "USD",
                                        }
                                    ).catch((err) => {
                                        const error = err.error
                                        const errorString = Array.isArray(error) ? error[0] : error
                                        toast.error(
                                            errorString ??
                                                "An error occurred while updating member cost details. Please try again."
                                        )
                                    })
                                }}
                                input
                                className="w-32"
                            >
                                <CustomSelect.Option value={true}>
                                    <div className="flex items-center gap-2">
                                        <Timer className="h-3.5 w-3.5" />
                                        <div>Per Hour</div>
                                    </div>
                                </CustomSelect.Option>
                                <CustomSelect.Option value={false}>
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="h-3.5 w-3.5" />
                                        <div>For Project</div>
                                    </div>
                                </CustomSelect.Option>
                            </CustomSelect>
                        </>
                    )}
                    <div className="w-20 flex gap-2">
                        <CustomSelect
                            customButton={
                                <div className="item-center flex gap-1 rounded px-2 py-0.5">
                                    <span
                                        className={`flex items-center rounded text-xs font-medium ${
                                            userDetails.member.id !== currentUser?.id ? "" : "text-custom-text-400"
                                        }`}
                                    >
                                        {ROLES[userDetails.role]}
                                    </span>
                                    {userDetails.member.id !== currentUser?.id && (
                                        <span className="grid place-items-center">
                                            <ChevronDown className="h-3 w-3" />
                                        </span>
                                    )}
                                </div>
                            }
                            value={userDetails.role}
                            onChange={(value: ERoles) => {
                                if (!workspaceSlug || !projectId) return

                                updateMember(workspaceSlug.toString(), projectId.toString(), userDetails.member.id, {
                                    role: value,
                                    rate: userDetails.rate?.rate ?? "0",
                                    per_hour_or_per_project: userDetails.rate?.per_hour_or_per_project ?? true,
                                    currency: userDetails.rate?.currency ?? "USD",
                                }).catch((err) => {
                                    const error = err.error
                                    const errorString = Array.isArray(error) ? error[0] : error

                                    toast.error(
                                        errorString ?? "An error occurred while updating member role. Please try again."
                                    )
                                })
                            }}
                            disabled={
                                userDetails.member.id === currentUser?.id ||
                                !currentProjectRole ||
                                currentProjectRole < userDetails.role
                            }
                            placement="bottom-end"
                        >
                            {Object.keys(ROLES).map((key) => {
                                if (currentProjectRole !== undefined && !isAdmin && currentProjectRole < parseInt(key))
                                    return null

                                return (
                                    <CustomSelect.Option key={key} value={key}>
                                        <>{ROLES[parseInt(key) as keyof typeof ROLES]}</>
                                    </CustomSelect.Option>
                                )
                            })}
                        </CustomSelect>
                        {(isAdmin || userDetails.member.id === currentUser?.id) && (
                            <Tooltip
                                tooltipContent={
                                    userDetails.member.id === currentUser?.id ? "Leave project" : "Remove member"
                                }
                            >
                                <button
                                    type="button"
                                    onClick={() => setRemoveMemberModal(true)}
                                    className="pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100"
                                >
                                    <XCircle className="h-3.5 w-3.5 text-red-500" strokeWidth={2} />
                                </button>
                            </Tooltip>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
})

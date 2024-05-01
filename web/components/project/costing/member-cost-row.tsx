import Link from "next/link"
import { useParams } from "next/navigation"

import { useRef, useState } from "react"

import { Briefcase, Dot, Timer } from "lucide-react"
import { observer } from "mobx-react-lite"
import toast from "react-hot-toast"

import { useMember, useUser } from "@hooks/store"
import useOutsideClickDetector from "@hooks/use-outside-click-detector"

import { CURRENCY_CODES } from "@constants/billing"
import { ERoles } from "@constants/iam"

import { formatAmount } from "@helpers/currency.helper"
import { convertSecondsToReadableTime } from "@helpers/date-time.helper"

import { CustomSelect, Input } from "@servcy/ui"

export const MemberCostRow: React.FC<{
    userId: string
    totalLoggedSeconds: number
}> = observer((props) => {
    const { userId, totalLoggedSeconds } = props
    const { workspaceSlug, projectId } = useParams()
    const {
        membership: { currentProjectRole, currentWorkspaceRole },
    } = useUser()
    const {
        project: { getProjectMemberDetails, updateMember },
    } = useMember()
    const isAdmin = currentProjectRole === ERoles.ADMIN
    const userDetails = getProjectMemberDetails(userId)
    const [rate, setRate] = useState(userDetails?.rate?.rate ?? "")
    const handleRateChange = () => {
        if (!workspaceSlug || !projectId || !userDetails) return
        updateMember(workspaceSlug.toString(), projectId.toString(), userDetails.member.id, {
            role: userDetails.role ?? ERoles.MEMBER,
            rate: rate,
            currency: userDetails.rate?.currency ?? "USD",
            per_hour_or_per_project: userDetails.rate?.per_hour_or_per_project ?? true,
        }).catch(() => {
            toast.error("Please try again later")
        })
    }
    const inputRateRef = useRef<HTMLInputElement>(null)
    useOutsideClickDetector(inputRateRef, async () => {
        if (rate === userDetails?.rate?.rate) return
        handleRateChange()
    })
    if (!userDetails) return null
    const memberCost = userDetails.rate?.per_hour_or_per_project
        ? (totalLoggedSeconds / 3600) * (Number(rate) ?? 0)
        : Number(rate) ?? 0
    return (
        <>
            <div className="group flex items-center justify-between px-3 py-4 hover:bg-custom-background-90 gap-4 max-md:flex-wrap">
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
                {!Number.isNaN(userDetails.rate?.rate) && currentWorkspaceRole === ERoles.ADMIN && (
                    <div className="flex items-center gap-2 text-xs max-md:flex-wrap">
                        <Input
                            id={`project-member.${userDetails.member.id}.rate`}
                            type="text"
                            value={rate}
                            placeholder="Member cost..."
                            ref={inputRateRef}
                            onChange={(e) => {
                                if (Number.isNaN(Number(e.target.value))) return
                                setRate(e.target.value)
                            }}
                            className="focus:border-green-300 w-28"
                        />
                        <CustomSelect
                            label={
                                <div className="flex items-center gap-1">{userDetails?.rate?.currency ?? "USD"}</div>
                            }
                            value={userDetails?.rate?.currency ?? "USD"}
                            placement="bottom-start"
                            noChevron
                            onChange={(value: string) => {
                                if (!workspaceSlug || !projectId) return
                                updateMember(workspaceSlug.toString(), projectId.toString(), userDetails.member.id, {
                                    role: userDetails.role ?? ERoles.MEMBER,
                                    rate: userDetails.rate?.rate ?? "0",
                                    currency: value,
                                    per_hour_or_per_project: userDetails.rate?.per_hour_or_per_project ?? true,
                                }).catch(() => {
                                    toast.error("Please try again later")
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
                                updateMember(workspaceSlug.toString(), projectId.toString(), userDetails.member.id, {
                                    role: userDetails.role ?? ERoles.MEMBER,
                                    rate: userDetails.rate?.rate ?? "0",
                                    per_hour_or_per_project: value,
                                    currency: userDetails.rate?.currency ?? "USD",
                                }).catch(() => {
                                    toast.error("Please try again later")
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
                        <div className="bg-custom-background-100 border border-custom-border-100 min-w-44 rounded-md truncate">
                            <pre className="bg-custom-background-80 rounded-md text-sm p-2">
                                {convertSecondsToReadableTime(`${totalLoggedSeconds}`)}
                            </pre>
                        </div>
                        <div className="text-sm bg-amber-600/20 rounded-md p-2 min-w-24 text-right text-amber-600">
                            {formatAmount(memberCost, userDetails.rate?.currency ?? "USD")}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
})

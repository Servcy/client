"use client"

import Link from "next/link"
import { useParams } from "next/navigation"

import { useEffect, useState } from "react"

import { CalendarClock } from "lucide-react"
import { observer } from "mobx-react-lite"
import useSWR from "swr"

import { NotAuthorizedView } from "@components/auth-screens"
import { GaugeChart } from "@components/ui"

import { useMember, useProject, useTimeTracker, useUser } from "@hooks/store"

import { ERoles } from "@constants/iam"

import { formatAmount } from "@helpers/currency.helper"

import { IMemberWiseCalculatedCost } from "@servcy/types"
import { Button, Loader } from "@servcy/ui"

import { MemberCostList } from "./member-cost-list"
import { MemberCostPieChart } from "./member-cost-pie-chart"

export const ProjectCostAnalysisRoot = observer(() => {
    const { projectId, workspaceSlug } = useParams()
    const { fetchProjectMemberWiseTimeLogged, fetchProjectMemberWiseEstimate } = useTimeTracker()
    const [totalCost, setTotalCost] = useState(0)
    const [estimatedCost, setEstimatedCost] = useState(0)
    const [memberWiseCalculatedMap, setMemberWiseCalculatedMap] = useState<Record<string, IMemberWiseCalculatedCost>>(
        {}
    )
    const { currentProjectDetails: projectDetails } = useProject()
    const {
        project: { projectMemberIds, getProjectMemberDetails },
    } = useMember()
    const {
        membership: { currentWorkspaceRole },
    } = useUser()
    const isWorkspaceAdmin = currentWorkspaceRole !== undefined && currentWorkspaceRole >= ERoles.ADMIN
    const { data: memberTimeLogData } = useSWR(
        workspaceSlug && projectId
            ? `PROJECT_MEMBER_WISE_TIME_LOGGED_${workspaceSlug.toString()}_${projectId.toString()}`
            : null,
        workspaceSlug && projectId
            ? () => fetchProjectMemberWiseTimeLogged(workspaceSlug.toString(), projectId.toString())
            : null
    )
    const { data: memberTimeEstimateData } = useSWR(
        workspaceSlug && projectId
            ? `PROJECT_MEMBER_WISE_ESTIMATE_${workspaceSlug.toString()}_${projectId.toString()}`
            : null,
        workspaceSlug && projectId
            ? () => fetchProjectMemberWiseEstimate(workspaceSlug.toString(), projectId.toString())
            : null
    )
    useEffect(() => {
        let cost = 0
        let estimate = 0
        projectMemberIds?.forEach((userId) => {
            const memberTimeLog = memberTimeLogData?.find((item) => item.created_by__id === userId)
            let memberSum = 0
            if (memberTimeLog && !Number.isNaN(Number(memberTimeLog.sum))) memberSum = Number(memberTimeLog.sum)
            const memberDetails = getProjectMemberDetails(userId)
            let memberCost = 0
            if (memberDetails?.rate?.per_hour_or_per_project) {
                memberCost = Number(memberDetails?.rate?.rate ?? "0") * (memberSum / 3600)
                const memberEstimate = memberTimeEstimateData?.find((item) => item.assignees__id === userId)
                if (memberEstimate) {
                    estimate += Number(memberDetails?.rate?.rate ?? "0") * Number(memberEstimate.sum)
                }
            } else {
                memberCost = Number(memberDetails?.rate?.rate) ?? 0
                estimate += Number(memberDetails?.rate?.rate) ?? 0
            }
            cost += memberCost
            const memberData = {
                created_by__avatar: memberTimeLog
                    ? memberTimeLog.created_by__avatar
                    : memberDetails?.member?.avatar ?? "",
                created_by__first_name: memberTimeLog
                    ? memberTimeLog.created_by__first_name
                    : memberDetails?.member?.first_name ?? "",
                created_by__last_name: memberTimeLog
                    ? memberTimeLog.created_by__last_name
                    : memberDetails?.member?.last_name ?? "",
                created_by__display_name: memberTimeLog
                    ? memberTimeLog.created_by__display_name
                    : memberDetails?.member?.display_name ?? "",
                created_by__id: userId,
                sum: memberSum,
                cost: memberCost,
            }
            setMemberWiseCalculatedMap((prev) => ({ ...prev, [userId]: memberData }))
        })
        setTotalCost(cost)
        setEstimatedCost(estimate)
    }, [memberTimeLogData, projectMemberIds, memberTimeEstimateData])
    return (
        <div className="h-full w-full">
            {!isWorkspaceAdmin ? (
                <NotAuthorizedView
                    type="workspace"
                    actionButton={
                        <Link href={`/${workspaceSlug}/time-tracker/my-timesheet`}>
                            <Button variant="primary" size="md" prependIcon={<CalendarClock />}>
                                Go to your timesheet
                            </Button>
                        </Link>
                    }
                />
            ) : memberTimeLogData ? (
                <div className="grid gap-4 px-3 py-3.5 max-md:grid-cols-1 md:grid-cols-2">
                    <div className="hover:shadow-custom-shadow-4xl bg-custom-background-100 border-custom-border-200 overflow-hidden rounded-xl border-[0.5px] px-3.5 py-6 duration-300">
                        <div className="flex items-center justify-center space-y-4">
                            <div className="bg-custom-background-80 text-custom-text-200 rounded px-3.5 py-3 text-center font-medium capitalize">
                                Budget Allocated:{" "}
                                {formatAmount(
                                    Number(projectDetails?.budget?.amount) ?? 0,
                                    projectDetails?.budget?.currency ?? "USD"
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-2">
                            <div>
                                <GaugeChart
                                    value={Math.ceil(
                                        Number(projectDetails?.budget?.amount) ?? 0
                                            ? 100 * (estimatedCost / (Number(projectDetails?.budget?.amount) ?? 0))
                                            : 0
                                    )}
                                />
                                <div className="text-custom-text-300 truncate text-center text-sm font-medium capitalize">
                                    Estimated Cost:{" "}
                                    {estimatedCost
                                        ? formatAmount(estimatedCost, projectDetails?.budget?.currency ?? "USD")
                                        : "-"}
                                </div>
                            </div>
                            <div>
                                <GaugeChart
                                    value={Math.ceil(
                                        Number(projectDetails?.budget?.amount) ?? 0
                                            ? 100 * (totalCost / (Number(projectDetails?.budget?.amount) ?? 0))
                                            : 0
                                    )}
                                />
                                <div className="text-custom-text-300 truncate text-center text-sm font-medium capitalize">
                                    Actual Cost:{" "}
                                    {totalCost
                                        ? formatAmount(totalCost, projectDetails?.budget?.currency ?? "USD")
                                        : "-"}
                                </div>
                            </div>
                        </div>
                    </div>
                    <MemberCostPieChart
                        memberWiseCalculatedMap={memberWiseCalculatedMap}
                        workspaceSlug={workspaceSlug.toString()}
                        totalCost={totalCost}
                    />
                </div>
            ) : (
                <Loader className="bg-custom-background-100 rounded-xl p-6">
                    <Loader.Item height="17px" width="35%" />
                    <div className="mt-12 flex items-center justify-between gap-32 pl-6">
                        <div className="grid w-1/2 place-items-center">
                            <div className="relative h-[184px] w-[184px] flex-shrink-0 overflow-hidden rounded-full">
                                <Loader.Item height="184px" width="184px" />
                                <div className="bg-custom-background-100 absolute left-1/2 top-1/2 h-[100px] w-[100px] -translate-x-1/2 -translate-y-1/2 rounded-full" />
                            </div>
                        </div>
                        <div className="w-1/2 flex-shrink-0 space-y-7">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <Loader.Item key={index} height="11px" width="100%" />
                            ))}
                        </div>
                    </div>
                </Loader>
            )}
            <MemberCostList memberWiseCalculatedMap={memberWiseCalculatedMap} />
        </div>
    )
})

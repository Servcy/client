"use client"

import { useParams } from "next/navigation"

import useSWR from "swr"

import { GaugeChart } from "@components/ui"

import { useMember, useTimeTracker } from "@hooks/store"

import { formatAmount } from "@helpers/currency.helper"

import { IMemberWiseCalculatedCost, IMemberWiseTimesheetDuration } from "@servcy/types"
import { Loader } from "@servcy/ui"

import { MemberCostList } from "./member-cost-list"
import { MemberCostPieChart } from "./member-cost-pie-chart"

export const ProjectCostAnalysisRoot = () => {
    const { projectId, workspaceSlug } = useParams()
    const { fetchProjectMemberWiseTimeLogged } = useTimeTracker()
    const {
        project: { getProjectMemberDetails },
    } = useMember()
    const { data: memberTimeLogData } = useSWR(
        workspaceSlug && projectId
            ? `PROJECT_MEMBER_WISE_TIME_LOGGED_${workspaceSlug.toString()}_${projectId.toString()}`
            : null,
        workspaceSlug && projectId
            ? () => fetchProjectMemberWiseTimeLogged(workspaceSlug.toString(), projectId.toString())
            : null
    )
    const memberWiseCalculatedMap = memberTimeLogData
        ? memberTimeLogData.reduce(
              (acc: Record<string, IMemberWiseCalculatedCost>, curr: IMemberWiseTimesheetDuration) => {
                  let sum = 0
                  if (Number.isNaN(Number(curr.sum))) sum = 0
                  else sum = parseInt(curr.sum)
                  const memberDetails = getProjectMemberDetails(curr.created_by__id)
                  let rate = 0
                  if (Number.isNaN(Number(memberDetails?.rate?.rate))) rate = 0
                  else {
                      if (memberDetails?.rate?.per_hour_or_per_project)
                          rate = (sum / 3600) * (Number(memberDetails?.rate?.rate) ?? 0)
                      else rate = Number(memberDetails?.rate?.rate ?? 0)
                  }
                  acc[curr.created_by__id] = {
                      ...curr,
                      sum,
                      cost: rate,
                  }
                  return acc
              },
              {}
          )
        : ({} as Record<string, IMemberWiseCalculatedCost>)

    return (
        <div className="h-full w-full">
            {memberTimeLogData ? (
                <div className="grid gap-4 px-3 py-3.5 max-md:grid-cols-1 md:grid-cols-2">
                    <div className="hover:shadow-custom-shadow-4xl bg-custom-background-100 border-custom-border-200 overflow-hidden rounded-xl border-[0.5px] px-3.5 py-6 duration-300">
                        <div className="flex items-center justify-center space-y-4">
                            <div className="bg-custom-background-80 text-custom-text-200 rounded px-3.5 py-3 text-center font-medium capitalize">
                                Budget Allocated: {formatAmount(10000, "USD")}
                            </div>
                        </div>
                        <div className="grid grid-cols-2">
                            <div>
                                <GaugeChart value={40} />
                                <div className="text-custom-text-300 truncate text-center text-sm font-medium capitalize">
                                    Estimated Cost
                                </div>
                            </div>
                            <div>
                                <GaugeChart value={89} />
                                <div className="text-custom-text-300 truncate text-center text-sm font-medium capitalize">
                                    Actual Cost
                                </div>
                            </div>
                        </div>
                    </div>
                    <MemberCostPieChart
                        memberWiseCalculatedMap={memberWiseCalculatedMap}
                        workspaceSlug={workspaceSlug.toString()}
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
}

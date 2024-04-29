import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { useState } from "react"

import { observer } from "mobx-react-lite"
import { useTheme } from "next-themes"
import DarkImage from "public/empty-state/dashboard/dark/issues-by-priority.svg"
import LightImage from "public/empty-state/dashboard/light/issues-by-priority.svg"

import { PieGraph } from "@components/ui"

import { INDEX_COLORS, INDEX_GRADIENTS } from "@constants/graph"

import { orderArrayBy } from "@helpers/array.helper"

import { IMemberWiseCalculatedCost, TStateGroups } from "@servcy/types"

export const MemberCostPieChart: React.FC<{
    memberWiseCalculatedMap: Record<string, IMemberWiseCalculatedCost>
    workspaceSlug: string
    totalCost: number
}> = observer(({ memberWiseCalculatedMap, totalCost, workspaceSlug }) => {
    const [activeMember, setActiveMember] = useState<string | null>(null)
    const { resolvedTheme } = useTheme()
    const image = resolvedTheme === "dark" ? DarkImage : LightImage
    const router = useRouter()
    const chartData = orderArrayBy(Object.values(memberWiseCalculatedMap), "-cost")
        ?.slice(0, 5)
        ?.map((item: any, index: number) => ({
            color: INDEX_COLORS[index],
            id: item?.created_by__id,
            label: item.created_by__display_name ?? item.created_by__first_name ?? "?",
            value: (item?.cost / totalCost) * 100,
        }))
    const CenteredMetric = ({ dataWithArc, centerX, centerY }: any) => {
        let data: any
        let percentage: any
        if (activeMember) {
            data = dataWithArc?.find((datum: any) => datum?.id === activeMember)
            percentage = chartData?.find((item: any) => item.id === activeMember)?.value?.toFixed(0)
        } else {
            data = dataWithArc?.[0]
            percentage = chartData?.[0]?.value?.toFixed(0)
        }
        return (
            <g>
                <text
                    x={centerX}
                    y={centerY - 8}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="text-3xl font-bold"
                    style={{
                        fill: data?.color,
                    }}
                >
                    {percentage}%
                </text>
                <text
                    x={centerX}
                    y={centerY + 20}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="text-sm font-medium fill-custom-text-300 capitalize"
                >
                    {data?.label?.slice(0, 8)}
                    {data.label.length > 8 ? "..." : ""}
                </text>
            </g>
        )
    }

    return (
        <div className="bg-custom-background-100 rounded-xl border-[0.5px] border-custom-border-200 w-full py-6 hover:shadow-custom-shadow-4xl duration-300 overflow-hidden min-h-96 flex flex-col">
            <div className="flex items-center px-7">
                <Link
                    href={`/${workspaceSlug}/time-tracker/my-timesheet`}
                    className="text-lg font-semibold text-custom-text-300 hover:underline"
                >
                    Top Members Cost:
                </Link>
            </div>
            {totalCost > 0 ? (
                <div className="flex items-center pl-10 md:pl-11 lg:pl-14 pr-11 mt-11">
                    <div className="flex flex-col sm:flex-row md:flex-row lg:flex-row items-center justify-evenly gap-x-10 gap-y-8 w-full">
                        <div>
                            <PieGraph
                                data={chartData}
                                height="220px"
                                width="200px"
                                innerRadius={0.6}
                                cornerRadius={5}
                                colors={(datum) => datum.data.color}
                                padAngle={1}
                                enableArcLinkLabels={false}
                                enableArcLabels={false}
                                activeOuterRadiusOffset={5}
                                tooltip={() => <></>}
                                margin={{
                                    top: 0,
                                    right: 5,
                                    bottom: 0,
                                    left: 5,
                                }}
                                defs={INDEX_GRADIENTS}
                                fill={chartData.map((p, index) => ({
                                    match: {
                                        id: p.id,
                                    },
                                    id: `gradient${index}`,
                                }))}
                                onClick={(datum, e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    router.push(`/${workspaceSlug}/time-tracker/workspace-timesheet`)
                                }}
                                onMouseEnter={(datum) => setActiveMember(datum.id as TStateGroups)}
                                onMouseLeave={() => setActiveMember(null)}
                                layers={["arcs", CenteredMetric]}
                            />
                        </div>
                        <div className="space-y-6 w-min whitespace-nowrap">
                            {chartData.map((item) => (
                                <div key={item.id} className="flex items-center justify-between gap-6">
                                    <div className="flex items-center gap-x-1 w-24 truncate text-custom-text-300 text-sm font-medium capitalize">
                                        {item.label}
                                    </div>
                                    <div className="flex items-center gap-x-2 w-14">
                                        <div
                                            className="size-3 rounded-full"
                                            style={{
                                                backgroundColor: item.color,
                                            }}
                                        />
                                        <div className="text-custom-text-400 text-sm">{item.value.toFixed(0)}%</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-full grid place-items-center">
                    <div className="text-center space-y-6 flex flex-col items-center">
                        <div className="h-24 w-24">
                            <Image src={image} className="w-full h-full" alt="Issues by state group" />
                        </div>
                        <p className="text-sm font-medium text-custom-text-300">
                            Cost analysis of members who have logged time on this project
                            <br />
                            will show up here.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
})

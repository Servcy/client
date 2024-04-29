import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { useState } from "react"

import { linearGradientDef } from "@nivo/core"
import { observer } from "mobx-react-lite"
import { useTheme } from "next-themes"
import DarkImage from "public/empty-state/dashboard/dark/issues-by-priority.svg"
import LightImage from "public/empty-state/dashboard/light/issues-by-priority.svg"

import { PieGraph } from "@components/ui"

import { renderEmoji } from "@helpers/emoji.helper"

import { ITimesheetAnalyticsResponse, TStateGroups } from "@servcy/types"
import { Loader } from "@servcy/ui"

const PROJECT_COLORS = ["#FFC53D", "#3E9B4F", "#E5484D", "#80838D", "#CDCED6"]
const PROJECT_GRAPH_GRADIENTS = [
    linearGradientDef("gradient0", [
        { offset: 0, color: "#DEDEDE" },
        { offset: 100, color: "#BABABE" },
    ]),
    linearGradientDef("gradient1", [
        { offset: 0, color: "#D4D4D4" },
        { offset: 100, color: "#878796" },
    ]),
    linearGradientDef("gradient2", [
        { offset: 0, color: "#FFD300" },
        { offset: 100, color: "#FAE270" },
    ]),
    linearGradientDef("gradient3", [
        { offset: 0, color: "#0E8B1B" },
        { offset: 100, color: "#37CB46" },
    ]),
    linearGradientDef("gradient4", [
        { offset: 0, color: "#C90004" },
        { offset: 100, color: "#FF7679" },
    ]),
]

export const ProjectTimesheetPieChart: React.FC<{
    analytics: ITimesheetAnalyticsResponse
    workspaceSlug: string
}> = observer(({ analytics, workspaceSlug }) => {
    const { project_wise_timesheet_duration } = analytics
    const [activeProject, setActiveProject] = useState<string | null>(null)
    const { resolvedTheme } = useTheme()
    const image = resolvedTheme === "dark" ? DarkImage : LightImage
    const router = useRouter()
    if (!project_wise_timesheet_duration)
        return (
            <Loader className="bg-custom-background-100 rounded-xl p-6">
                <Loader.Item height="17px" width="35%" />
                <div className="flex items-center justify-between gap-32 mt-12 pl-6">
                    <div className="w-1/2 grid place-items-center">
                        <div className="rounded-full overflow-hidden relative flex-shrink-0 h-[184px] w-[184px]">
                            <Loader.Item height="184px" width="184px" />
                            <div className="absolute h-[100px] w-[100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-custom-background-100 rounded-full" />
                        </div>
                    </div>
                    <div className="w-1/2 space-y-7 flex-shrink-0">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <Loader.Item key={index} height="11px" width="100%" />
                        ))}
                    </div>
                </div>
            </Loader>
        )
    const totalCount = project_wise_timesheet_duration?.reduce((acc, item) => {
        if (item.sum) return acc + parseInt(item.sum)
        return acc
    }, 0)
    const chartData = project_wise_timesheet_duration
        ?.filter((duration) => duration.sum)
        ?.map((duration) => ({ ...duration, sum: parseInt(duration.sum) }))
        ?.slice(0, 5)
        ?.map((item, index) => ({
            color: PROJECT_COLORS[index],
            id: item?.project_id,
            label: item?.project__name,
            value: (item?.sum / totalCount) * 100,
            emoji: item?.project__emoji,
        }))
    const CenteredMetric = ({ dataWithArc, centerX, centerY }: any) => {
        let data: any
        let percentage: any
        if (activeProject) {
            data = dataWithArc?.find((datum: any) => datum?.id === activeProject)
            percentage = chartData?.find((item) => item.id === activeProject)?.value?.toFixed(0)
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
                    Top 5 Projects
                </Link>
            </div>
            {totalCount > 0 ? (
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
                                defs={PROJECT_GRAPH_GRADIENTS}
                                fill={[0, 1, 2, 3, 4].map((p) => ({
                                    match: {
                                        id: p,
                                    },
                                    id: `gradient${p}`,
                                }))}
                                onClick={(datum, e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    router.push(`/${workspaceSlug}/projects/${datum.id}/budget/timesheet`)
                                }}
                                onMouseEnter={(datum) => setActiveProject(datum.id as TStateGroups)}
                                onMouseLeave={() => setActiveProject(null)}
                                layers={["arcs", CenteredMetric]}
                            />
                        </div>
                        <div className="space-y-6 w-min whitespace-nowrap">
                            {chartData.map((item) => (
                                <div key={item.id} className="flex items-center justify-between gap-6">
                                    <div className="flex items-center gap-x-1 w-24 truncate text-custom-text-300 text-sm font-medium capitalize">
                                        {renderEmoji(item.emoji)} {item.label}
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
                            Time logged by you, broken down by project,
                            <br />
                            will show up here.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
})

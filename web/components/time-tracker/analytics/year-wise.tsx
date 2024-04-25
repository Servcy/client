// image
import emptyGraph from "public/empty-state/empty_graph.svg"

import { LineGraph, ProfileEmptyState } from "@components/ui"

import { MONTHS_LIST } from "@constants/calendar"

import { ITimesheetAnalyticsResponse } from "@servcy/types"

export const TimesheetYearWiseLogs: React.FC<{
    analytics: ITimesheetAnalyticsResponse
}> = ({ analytics }) => (
    <div className="rounded-[10px] border border-custom-border-200 py-3">
        <h1 className="px-3 text-base font-medium">Hours logged in a year</h1>
        {analytics.month_wise_timesheet_duration.length > 0 ? (
            <LineGraph
                data={[
                    {
                        id: "time_logged",
                        color: "rgb(var(--color-primary-100))",
                        data: Object.entries(MONTHS_LIST).map(([index, month]) => ({
                            x: month.shortTitle,
                            y:
                                Math.floor(
                                    Number(
                                        analytics.month_wise_timesheet_duration.find(
                                            (data) => data.month === parseInt(index, 10)
                                        )?.sum
                                    ) / 3600
                                ) || 0,
                        })),
                    },
                ]}
                customYAxisTickValues={analytics.month_wise_timesheet_duration.map((data) =>
                    Math.floor(Number(data.sum) / 3600)
                )}
                height="300px"
                colors={(datum) => datum.color}
                curve="monotoneX"
                margin={{ top: 20 }}
                enableSlices="x"
                sliceTooltip={(datum) => (
                    <div className="rounded-md border border-custom-border-200 bg-custom-background-80 p-2 text-xs">
                        {datum.slice.points[0].data.yFormatted}
                        <span className="text-custom-text-200"> hours logged in </span>
                        {datum.slice.points[0].data.xFormatted}
                    </div>
                )}
                theme={{
                    background: "rgb(var(--color-background-100))",
                }}
                enableArea
            />
        ) : (
            <div className="px-7 py-4">
                <ProfileEmptyState
                    title="No Data yet"
                    description="Log time to view analysis of the same in the form of a graph."
                    image={emptyGraph}
                />
            </div>
        )}
    </div>
)

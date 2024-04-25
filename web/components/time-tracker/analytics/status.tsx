import { convertSecondsToReadableTime } from "@helpers/date-time.helper"

import { ITimesheetAnalyticsResponse } from "@servcy/types"
import { Tooltip } from "@servcy/ui"

const calculatePercentage = (value: string | null, total: string | null) => {
    if (!value || !total) return 0
    return ((parseInt(value) / parseInt(total)) * 100).toFixed(0)
}

export const TimesheetDurationStats: React.FC<{
    analytics: ITimesheetAnalyticsResponse
}> = ({ analytics }) => (
    <div className="border-custom-border-200 space-y-6 rounded-[10px] border p-6">
        <div className="flex items-center justify-between">
            <h5 className="text-custom-primary-400 text-xs">SUPPLY</h5>
            <h3 className="bg-custom-background-80 text-custom-text-200 text-md rounded p-2 font-semibold">
                {convertSecondsToReadableTime(analytics.total_timesheet_duration)}
            </h3>
        </div>
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1">
                        <span
                            className="size-2 rounded-full"
                            style={{
                                backgroundColor: "#d9d9d9",
                            }}
                        />
                        <h6 className="capitalize">Billable</h6>
                        <span className="bg-custom-background-80 text-custom-text-200 ml-1 rounded-3xl px-2 py-0.5 text-[0.65rem]">
                            {convertSecondsToReadableTime(analytics.billable_timesheet_duration)}
                        </span>
                    </div>
                    <p className="text-custom-text-200">
                        {calculatePercentage(analytics.billable_timesheet_duration, analytics.total_timesheet_duration)}
                        %
                    </p>
                </div>
                <div className="bar bg-custom-background-80 relative h-1.5 w-full rounded">
                    <div
                        className="absolute left-0 top-0 h-1.5 rounded duration-300"
                        style={{
                            width: `${calculatePercentage(
                                analytics.billable_timesheet_duration,
                                analytics.total_timesheet_duration
                            )}%`,
                            backgroundColor: "#d9d9d9",
                        }}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1">
                        <span
                            className="size-2 rounded-full"
                            style={{
                                backgroundColor: "#4d7e3e",
                            }}
                        />
                        <h6 className="capitalize">Approved</h6>
                        <span className="bg-custom-background-80 text-custom-text-200 ml-1 rounded-3xl px-2 py-0.5 text-[0.65rem]">
                            {convertSecondsToReadableTime(analytics.approved_timesheet_duration)}
                        </span>
                    </div>
                    <p className="text-custom-text-200">
                        {calculatePercentage(analytics.approved_timesheet_duration, analytics.total_timesheet_duration)}
                        %
                    </p>
                </div>
                <div className="bar bg-custom-background-80 relative h-1.5 w-full rounded">
                    <div
                        className="absolute left-0 top-0 h-1.5 rounded duration-300"
                        style={{
                            width: `${calculatePercentage(
                                analytics.approved_timesheet_duration,
                                analytics.total_timesheet_duration
                            )}%`,
                            backgroundColor: "#4d7e3e",
                        }}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1">
                        <span
                            className="size-2 rounded-full"
                            style={{
                                backgroundColor: "#f59e0b",
                            }}
                        />
                        <Tooltip tooltipContent="End time was manually added/updated" position="top-left">
                            <h6 className="capitalize">Manual</h6>
                        </Tooltip>
                        <span className="bg-custom-background-80 text-custom-text-200 ml-1 rounded-3xl px-2 py-0.5 text-[0.65rem]">
                            {convertSecondsToReadableTime(analytics.manually_added_timesheet_duration)}
                        </span>
                    </div>
                    <p className="text-custom-text-200">
                        {calculatePercentage(
                            analytics.manually_added_timesheet_duration,
                            analytics.total_timesheet_duration
                        )}
                        %
                    </p>
                </div>
                <div className="bar bg-custom-background-80 relative h-1.5 w-full rounded">
                    <div
                        className="absolute left-0 top-0 h-1.5 rounded duration-300"
                        style={{
                            width: `${calculatePercentage(
                                analytics.manually_added_timesheet_duration,
                                analytics.total_timesheet_duration
                            )}%`,
                            backgroundColor: "#f59e0b",
                        }}
                    />
                </div>
            </div>
        </div>
    </div>
)

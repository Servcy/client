import Link from "next/link"
import { useParams } from "next/navigation"

import { FC, useRef } from "react"

import { useMember } from "@hooks/store"

import { calculateTimeBetween, renderFormattedDateTime } from "@helpers/date-time.helper"

import { ITimesheetDisplayPropertyOptions, ITrackedTime } from "@servcy/types"

interface ITimesheetRowCell {
    timeLog: ITrackedTime
    property: keyof ITimesheetDisplayPropertyOptions
}

export const TimesheetRowCell: FC<ITimesheetRowCell> = ({ timeLog, property }) => {
    const { workspaceSlug } = useParams()

    const {
        workspace: { getWorkspaceMemberDetails },
    } = useMember()
    const memberDetails = getWorkspaceMemberDetails(timeLog.created_by)
    const tableCellRef = useRef<HTMLTableCellElement | null>(null)
    switch (property) {
        case "description":
            return (
                <td
                    tabIndex={0}
                    className="h-11 w-full min-w-[8rem] bg-custom-background-100 text-sm after:absolute after:w-full after:bottom-[-1px] after:border after:border-custom-border-100 border-r-[1px] border-custom-border-100"
                    ref={tableCellRef}
                >
                    {timeLog.description.length > 0 ? (
                        <div className="h-11 border-b-[0.5px] border-custom-border-200 truncate p-2 flex items-center">
                            {timeLog.description}
                        </div>
                    ) : (
                        <div className="h-11 border-b-[0.5px] border-custom-border-200 truncate p-2 flex items-center">
                            N/A
                        </div>
                    )}
                </td>
            )
        case "start_time":
            return (
                <td
                    tabIndex={0}
                    className="h-11 w-full min-w-[8rem] bg-custom-background-100 text-sm after:absolute after:w-full after:bottom-[-1px] after:border after:border-custom-border-100 border-r-[1px] border-custom-border-100"
                    ref={tableCellRef}
                >
                    <div className="h-11 border-b-[0.5px] border-custom-border-200 p-2">
                        <pre className="bg-custom-background-80 rounded-md p-2">
                            {renderFormattedDateTime(timeLog.start_time, "MMM dd, HH:mm:ss")}
                        </pre>
                    </div>
                </td>
            )
        case "duration":
            return (
                <td
                    tabIndex={0}
                    className="h-11 w-full min-w-[8rem] bg-custom-background-100 text-sm after:absolute after:w-full after:bottom-[-1px] after:border after:border-custom-border-100 border-r-[1px] border-custom-border-100"
                    ref={tableCellRef}
                >
                    <div className="h-11 border-b-[0.5px] border-custom-border-200 p-2">
                        <pre className="bg-custom-background-80 rounded-md p-2">
                            {calculateTimeBetween(timeLog.start_time, timeLog.end_time, {
                                addSuffix: false,
                                includeSeconds: true,
                            })}
                        </pre>
                    </div>
                </td>
            )
        case "end_time":
            return (
                <td
                    tabIndex={0}
                    className="h-11 w-full min-w-[8rem] bg-custom-background-100 text-sm after:absolute after:w-full after:bottom-[-1px] after:border after:border-custom-border-100 border-r-[1px] border-custom-border-100"
                    ref={tableCellRef}
                >
                    <div className="h-11 border-b-[0.5px] border-custom-border-200 p-2">
                        <pre className="bg-custom-background-80 rounded-md p-2">
                            {renderFormattedDateTime(timeLog.end_time, "MMM dd, HH:mm:ss")}
                        </pre>
                    </div>
                </td>
            )
        case "created_by":
            if (!memberDetails) return <></>
            return (
                <td
                    tabIndex={0}
                    className="h-11 w-full min-w-[8rem] bg-custom-background-100 text-sm after:absolute after:w-full after:bottom-[-1px] after:border after:border-custom-border-100 border-r-[1px] border-custom-border-100"
                    ref={tableCellRef}
                >
                    <div className="h-11 border-b-[0.5px] border-custom-border-200 p-2 flex justify-center items-center gap-x-2">
                        {memberDetails.member.avatar && memberDetails.member.avatar.trim() !== "" ? (
                            <Link href={`/${workspaceSlug}/profile/${memberDetails.member.id}`}>
                                <span className="relative flex size-4 items-center justify-center rounded p-4 capitalize text-white">
                                    <img
                                        src={memberDetails.member.avatar}
                                        className="absolute left-0 top-0 h-full w-full rounded object-cover"
                                        alt={memberDetails.member.display_name || memberDetails.member.email}
                                    />
                                </span>
                            </Link>
                        ) : (
                            <Link href={`/${workspaceSlug}/profile/${memberDetails.member.id}`}>
                                <span className="relative flex size-4 items-center justify-center rounded-xl bg-gray-700 p-4 capitalize text-white">
                                    {(memberDetails.member.email ?? memberDetails.member.display_name ?? "?")[0]}
                                </span>
                            </Link>
                        )}
                        <div>
                            <Link href={`/${workspaceSlug}/profile/${memberDetails.member.id}`}>
                                <span className="text-sm font-medium">
                                    {memberDetails.member.first_name} {memberDetails.member.last_name}
                                </span>
                            </Link>
                        </div>
                    </div>
                </td>
            )
        default:
            return <></>
    }
}

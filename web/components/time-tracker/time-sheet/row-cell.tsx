import Link from "next/link"
import { useParams } from "next/navigation"

import { FC, useRef } from "react"

import { BadgeAlert, ShieldCheck } from "lucide-react"

import { useMember } from "@hooks/store"

import { calculateTimeBetween, renderFormattedDateTime } from "@helpers/date-time.helper"

import { ITimesheetDisplayPropertyOptions, ITrackedTime } from "@servcy/types"

import { ApprovalColumn } from "./columns/approve-column"
import { DescriptionColumn } from "./columns/description-column"
import { EndTimePicker } from "./columns/end-time-picker"
import { IsBillableColumn } from "./columns/is-billable-column"
import { SnapshotsColumn } from "./columns/snapshots-column"

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
            return <DescriptionColumn tableCellRef={tableCellRef} timeLog={timeLog} />
        case "start_time":
            return (
                <td
                    tabIndex={0}
                    className="bg-custom-background-100 after:border-custom-border-100 border-custom-border-100 h-11 w-full min-w-[10rem] border-r-[1px] text-sm after:absolute after:bottom-[-1px] after:w-full after:border"
                    ref={tableCellRef}
                >
                    <div className="border-custom-border-200 h-11 border-b-[0.5px] p-2">
                        <pre className="bg-custom-background-80 rounded-md p-2">
                            {renderFormattedDateTime(timeLog.start_time, "MMM dd HH:mm:ss")}
                        </pre>
                    </div>
                </td>
            )
        case "is_billable":
            return <IsBillableColumn tableCellRef={tableCellRef} timeLog={timeLog} />
        case "is_manually_added":
            return (
                <td
                    tabIndex={0}
                    className="bg-custom-background-100 after:border-custom-border-100 border-custom-border-100 h-11 w-full min-w-[8rem] border-r-[1px] text-sm after:absolute after:bottom-[-1px] after:w-full after:border"
                    ref={tableCellRef}
                >
                    <div className="border-custom-border-200 justify-left flex h-11 items-center gap-x-2 truncate border-b-[0.5px] px-4 py-2">
                        {!timeLog.is_manually_added ? (
                            <ShieldCheck className="text-custom-primary-100 size-4" />
                        ) : (
                            <BadgeAlert className="size-4 text-amber-700" />
                        )}
                        <div>{timeLog.is_manually_added ? "Manual" : "Tracked"}</div>
                    </div>
                </td>
            )
        case "is_approved":
            return <ApprovalColumn tableCellRef={tableCellRef} timeLog={timeLog} />
        case "duration":
            return (
                <td
                    tabIndex={0}
                    className="bg-custom-background-100 after:border-custom-border-100 border-custom-border-100 h-11 w-full min-w-[14rem] border-r-[1px] text-sm after:absolute after:bottom-[-1px] after:w-full after:border"
                    ref={tableCellRef}
                >
                    <div className="border-custom-border-200 h-11 border-b-[0.5px] p-2">
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
            return <EndTimePicker tableCellRef={tableCellRef} timeLog={timeLog} />
        case "created_by":
            if (!memberDetails) return <></>
            return (
                <td
                    tabIndex={0}
                    className="bg-custom-background-100 after:border-custom-border-100 border-custom-border-100 h-11 w-full min-w-[12rem] border-r-[1px] text-sm after:absolute after:bottom-[-1px] after:w-full after:border"
                    ref={tableCellRef}
                >
                    <div className="border-custom-border-200 flex h-11 items-center gap-x-2 border-b-[0.5px] p-2">
                        {memberDetails.member.avatar && memberDetails.member.avatar.trim() !== "" ? (
                            <Link
                                href={`/${workspaceSlug}/profile/${memberDetails.member.id}`}
                                className="relative size-5 flex-shrink-0 rounded-full"
                            >
                                <img
                                    src={memberDetails.member.avatar}
                                    className="absolute left-0 top-0 h-full w-full rounded-full object-cover"
                                    alt={memberDetails.member.display_name || memberDetails.member.email}
                                />
                            </Link>
                        ) : (
                            <Link
                                href={`/${workspaceSlug}/profile/${memberDetails.member.id}`}
                                className="grid size-5 flex-shrink-0 place-items-center rounded-full bg-gray-700 text-[11px] capitalize text-white"
                            >
                                {(memberDetails.member.email ?? memberDetails.member.display_name ?? "?")[0]}
                            </Link>
                        )}
                        <Link
                            href={`/${workspaceSlug}/profile/${memberDetails.member.id}`}
                            className="text-sm font-medium"
                        >
                            {memberDetails.member.first_name} {memberDetails.member.last_name}
                        </Link>
                    </div>
                </td>
            )
        case "snapshots_count":
            return <SnapshotsColumn tableCellRef={tableCellRef} timeLog={timeLog} />
        default:
            return <></>
    }
}

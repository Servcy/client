import Link from "next/link.js"
import { useParams } from "next/navigation"

import { FC, useEffect } from "react"

import { Timer } from "lucide-react"
import { observer } from "mobx-react-lite"

import { useMember, useTimeTracker } from "@hooks/store"

import { calculateTimeBetween, renderFormattedDateTime } from "@helpers/date-time.helper"

import { Loader } from "@servcy/ui"

type TTimeLog = {
    issueId: string
}

export const TrackedTimeLog: FC<TTimeLog> = observer(({ issueId }) => {
    const { workspaceSlug } = useParams()
    const { fetchTimeSheet, loadingTimeSheet, getTrackTimeByIssueId } = useTimeTracker()
    const timeLogs = getTrackTimeByIssueId(issueId)
    const {
        workspace: { getWorkspaceMemberDetails },
    } = useMember()

    useEffect(() => {
        if (issueId && workspaceSlug) fetchTimeSheet(workspaceSlug, { issue_id: issueId })
    }, [issueId])

    if (!workspaceSlug) return <></>

    if (loadingTimeSheet)
        return (
            <Loader className="mt-5 space-y-5">
                <Loader.Item height="40px" />
                <Loader.Item height="40px" />
                <Loader.Item height="40px" />
                <Loader.Item height="40px" />
            </Loader>
        )

    if (timeLogs.length === 0 || !timeLogs)
        return (
            <div className="flex items-center justify-center h-40 text-custom-text-100">
                Press{" "}
                <kbd className="grid mx-2 h-6 min-w-[1.5rem] place-items-center rounded-sm border-[0.5px] border-custom-border-200 bg-custom-background-90 px-1.5 text-[10px] text-custom-text-200">
                    T
                </kbd>{" "}
                to start tracking time.
            </div>
        )

    return (
        <div>
            {timeLogs.map((timeLog, index) => {
                const memberDetails = getWorkspaceMemberDetails(timeLog.created_by)?.member
                return (
                    <div
                        className={`relative flex items-center gap-3 text-xs ${index === 0 ? "pb-2" : index === timeLogs.length - 1 ? "pt-2" : "py-2"}`}
                    >
                        <div
                            className="absolute left-[13px] top-0 bottom-0 w-0.5 bg-custom-background-80"
                            aria-hidden={true}
                        />
                        <div className="flex-shrink-0 ring-6 w-7 h-7 rounded-full overflow-hidden flex justify-center items-center z-[4] bg-custom-background-80 text-custom-text-200">
                            <Timer className="h-4 w-4 flex-shrink-0" />
                        </div>
                        <div className="w-full text-custom-text-200">
                            <Link
                                href={`/${workspaceSlug.toString()}/profile/${memberDetails?.id}`}
                                className="hover:underline text-custom-text-100 font-medium"
                            >
                                {memberDetails?.display_name}
                            </Link>
                            <span className="truncate">
                                {" "}
                                logged
                                <pre className="inline text-sm bg-custom-background-80 rounded-md p-1 ml-1">
                                    {calculateTimeBetween(timeLog["start_time"], timeLog["end_time"], {
                                        addSuffix: false,
                                        includeSeconds: true,
                                    })}
                                </pre>{" "}
                                starting at
                                <pre className="inline text-sm bg-custom-background-80 rounded-md p-1 ml-1">
                                    {renderFormattedDateTime(timeLog["start_time"])}
                                </pre>
                            </span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
})

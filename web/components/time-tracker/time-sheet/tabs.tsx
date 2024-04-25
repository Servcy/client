import Link from "next/link"
import { useParams } from "next/navigation"

import React, { useRef } from "react"

import { observer } from "mobx-react-lite"

export const TimesheetViewTabs: React.FC = observer(() => {
    const containerRef = useRef<HTMLDivElement>(null)
    const { workspaceSlug, viewKey } = useParams()
    return (
        <>
            <div className="border-custom-border-200 group relative flex justify-between border-b">
                <div
                    ref={containerRef}
                    className="horizontal-scrollbar scrollbar-sm flex w-full items-center overflow-x-auto px-4"
                >
                    <Link id="my-timesheet" href={`/${workspaceSlug}/time-tracker/my-timesheet`}>
                        <span
                            className={`flex min-w-min flex-shrink-0 whitespace-nowrap border-b-2 p-3 text-sm font-medium outline-none ${
                                "my-timesheet" === viewKey
                                    ? "border-custom-primary-100 text-custom-primary-100"
                                    : "hover:border-custom-border-200 hover:text-custom-text-400 border-transparent"
                            }`}
                        >
                            My Timesheet
                        </span>
                    </Link>
                    <Link id="workspace-timesheet" href={`/${workspaceSlug}/time-tracker/workspace-timesheet`}>
                        <span
                            className={`flex min-w-min flex-shrink-0 whitespace-nowrap border-b-2 p-3 text-sm font-medium outline-none ${
                                "workspace-timesheet" === viewKey
                                    ? "border-custom-primary-100 text-custom-primary-100"
                                    : "hover:border-custom-border-200 hover:text-custom-text-400 border-transparent"
                            }`}
                        >
                            Workspace Timesheet
                        </span>
                    </Link>
                </div>
            </div>
        </>
    )
})

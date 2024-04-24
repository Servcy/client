import Link from "next/link"
import { useParams } from "next/navigation"

import React, { useRef } from "react"

import { observer } from "mobx-react-lite"

export const TimesheetViewTabs: React.FC = observer(() => {
    const containerRef = useRef<HTMLDivElement>(null)
    const { workspaceSlug, viewKey } = useParams()
    return (
        <>
            <div className="group relative flex border-b border-custom-border-200">
                <div
                    ref={containerRef}
                    className="flex w-full items-center overflow-x-auto px-4 horizontal-scrollbar scrollbar-sm"
                >
                    <Link id="my-timesheet" href={`/${workspaceSlug}/time-tracker/my-timesheet`}>
                        <span
                            className={`flex min-w-min flex-shrink-0 whitespace-nowrap border-b-2 p-3 text-sm font-medium outline-none ${
                                "my-timesheet" === viewKey
                                    ? "border-custom-primary-100 text-custom-primary-100"
                                    : "border-transparent hover:border-custom-border-200 hover:text-custom-text-400"
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
                                    : "border-transparent hover:border-custom-border-200 hover:text-custom-text-400"
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

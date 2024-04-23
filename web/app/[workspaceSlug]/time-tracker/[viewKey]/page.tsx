"use client"

import { useParams } from "next/navigation"

import { observer } from "mobx-react"

import { PageHead } from "@components/core"
import { TimesheetHeader } from "@components/headers"

import { AppWrapper } from "@wrappers/app"

const GlobalTimeTrackerPage = observer(() => {
    const { viewKey } = useParams<{ viewKey: "my-timesheet" | "workspace-timesheet" }>()

    if (["my-timesheet", "workspace-timesheet"].includes(viewKey) === false) return null

    return (
        <AppWrapper header={<TimesheetHeader activeLayout={viewKey} />}>
            <PageHead title={viewKey === "my-timesheet" ? "My Timesheet" : "Workspace Timesheet"} />
            <div className="h-full overflow-hidden bg-custom-background-100">
                <div className="flex h-full w-full flex-col border-b border-custom-border-300" />
            </div>
        </AppWrapper>
    )
})

export default GlobalTimeTrackerPage

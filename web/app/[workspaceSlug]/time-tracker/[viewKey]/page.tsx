"use client"

import { useParams } from "next/navigation"

import { CalendarClock } from "lucide-react"
import { observer } from "mobx-react"

import { PageHead } from "@components/core"
import { DefaultHeader } from "@components/headers"

import { AppWrapper } from "@wrappers/app"

const GlobalTimeTrackerPage = observer(() => {
    const { viewKey } = useParams<{ viewKey: "my-timesheet" | "workspace-timesheet" }>()

    return (
        <AppWrapper
            header={
                <DefaultHeader
                    title={viewKey === "my-timesheet" ? "My Timesheet" : "Workspace Timesheet"}
                    icon={<CalendarClock className="h-4 w-4 text-custom-text-300" />}
                />
            }
        >
            <PageHead title={viewKey === "my-timesheet" ? "My Timesheet" : "Workspace Timesheet"} />
            <div className="h-full overflow-hidden bg-custom-background-100">
                <div className="flex h-full w-full flex-col border-b border-custom-border-300" />
            </div>
        </AppWrapper>
    )
})

export default GlobalTimeTrackerPage

"use client"

import Link from "next/link"
import { useParams } from "next/navigation"

import { CalendarClock } from "lucide-react"
import { observer } from "mobx-react"

import { NotAuthorizedView } from "@components/auth-screens"
import { PageHead } from "@components/core"
import { TimesheetHeader } from "@components/headers"
import { TimeSheetRoot } from "@components/time-tracker"

import { useUser } from "@hooks/store"

import { ERoles } from "@constants/iam"

import { AppWrapper } from "@wrappers/app"

import { Button } from "@servcy/ui"

const GlobalTimeTrackerPage = observer(() => {
    const { viewKey, workspaceSlug } = useParams<{
        workspaceSlug: string
        viewKey: "my-timesheet" | "workspace-timesheet"
    }>()
    const {
        membership: { currentWorkspaceRole },
    } = useUser()
    const isWorkspaceAdmin = currentWorkspaceRole === ERoles.ADMIN

    if (!["my-timesheet", "workspace-timesheet"].includes(viewKey)) return null
    return (
        <AppWrapper header={<TimesheetHeader activeLayout={viewKey} />}>
            <PageHead title={viewKey === "my-timesheet" ? "My Timesheet" : "Workspace Timesheet"} />
            <div className="h-full overflow-hidden bg-custom-background-100">
                <div className="flex h-full w-full flex-col border-b border-custom-border-300">
                    {!isWorkspaceAdmin && viewKey === "workspace-timesheet" ? (
                        <NotAuthorizedView
                            type="workspace"
                            actionButton={
                                <Link href={`/${workspaceSlug}/time-tracker/my-timesheet`}>
                                    <Button variant="primary" size="md" prependIcon={<CalendarClock />}>
                                        Go to your timesheet
                                    </Button>
                                </Link>
                            }
                        />
                    ) : (
                        <TimeSheetRoot />
                    )}
                </div>
            </div>
        </AppWrapper>
    )
})

export default GlobalTimeTrackerPage

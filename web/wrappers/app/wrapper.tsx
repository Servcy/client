import { FC, ReactNode } from "react"

import { observer } from "mobx-react-lite"

import { CommandPalette } from "@components/command-palette"
import { TimeTrackerWidget } from "@components/issues"

import { useTimeTracker } from "@hooks/store"

import ProjectAuthWrapper from "@wrappers/auth/ProjectAuthWrapper"
import UserAuthWrapper from "@wrappers/auth/UserAuthWrapper"
import WorkspaceAuthWrapper from "@wrappers/auth/WorkspaceAuthWrapper"

import { AppSidebar } from "./sidebar"

export interface IAppLayout {
    children: ReactNode
    header: ReactNode
    withProjectWrapper?: boolean
}

export const AppWrapper: FC<IAppLayout> = observer((props) => {
    const { children, header, withProjectWrapper = false } = props
    const { runningTimeTracker } = useTimeTracker()

    return (
        <>
            <CommandPalette />
            <UserAuthWrapper>
                <WorkspaceAuthWrapper>
                    <div className="relative flex h-screen w-full overflow-hidden">
                        <AppSidebar />
                        <main className="relative flex h-full w-full flex-col overflow-hidden bg-custom-background-100">
                            {header}
                            <div className="h-full w-full overflow-hidden">
                                <div className="relative h-full w-full overflow-x-hidden overflow-y-scroll">
                                    {withProjectWrapper ? (
                                        <ProjectAuthWrapper>{children}</ProjectAuthWrapper>
                                    ) : (
                                        <>{children}</>
                                    )}
                                </div>
                            </div>
                        </main>
                        {runningTimeTracker && (
                            <>
                                <TimeTrackerWidget />
                            </>
                        )}
                    </div>
                </WorkspaceAuthWrapper>
            </UserAuthWrapper>
        </>
    )
})

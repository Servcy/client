import { useParams } from "next/navigation"

import { FC, useCallback, useEffect, useMemo, useRef } from "react"

import { observer } from "mobx-react-lite"

import {
    TimeLogQuickActions,
    TimeLogRow,
    TimesheetTableHeadCell,
    WithDisplayPropertiesHOC,
} from "@components/time-tracker"

import { useTimeTracker } from "@hooks/store"
import { useTableKeyboardNavigation } from "@hooks/use-table-keyboard-navigation"

import { TIMESHEET_PROPERTY_LIST } from "@constants/timesheet"

import { ITimesheetDisplayFilterOptions, ITimesheetDisplayPropertyOptions, ITrackedTime } from "@servcy/types"

interface ITimeLogTable {
    displayFilters: ITimesheetDisplayFilterOptions
    displayProperties: ITimesheetDisplayPropertyOptions
}

export const TimeLogTable: FC<ITimeLogTable> = observer(({ displayProperties, displayFilters }) => {
    const containerRef = useRef<HTMLTableElement | null>(null)
    const isScrolled = useRef(false)
    const { workspaceSlug } = useParams()
    const { timesheet, deleteTimeLog } = useTimeTracker()
    const portalRef = useRef<HTMLDivElement | null>(null)
    const handleKeyBoardNavigation = useTableKeyboardNavigation()

    const handleScroll = () => {
        if (!containerRef.current) return
        const scrollLeft = containerRef.current.scrollLeft
        const columnShadow = "8px 22px 22px 10px rgba(0, 0, 0, 0.05)"
        const headerShadow = "8px -22px 22px 10px rgba(0, 0, 0, 0.05)"
        //The shadow styles are added this way to avoid re-render of all the rows of table, which could be costly
        if (scrollLeft > 0 !== isScrolled.current) {
            const firtColumns = containerRef.current.querySelectorAll("table tr td:first-child, th:first-child")
            for (let i = 0; i < firtColumns.length; i++) {
                const shadow = i === 0 ? headerShadow : columnShadow
                if (scrollLeft > 0) {
                    ;(firtColumns[i] as HTMLElement).style.boxShadow = shadow
                } else {
                    ;(firtColumns[i] as HTMLElement).style.boxShadow = "none"
                }
            }
            isScrolled.current = scrollLeft > 0
        }
    }

    const timeLogActions = useMemo(
        () => ({
            ["DELETE"]: async (timeLog: ITrackedTime) => {
                if (!workspaceSlug) return
                await deleteTimeLog(workspaceSlug.toString(), timeLog.project, timeLog.id)
            },
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [deleteTimeLog, workspaceSlug]
    )

    const handleTimeLog = useCallback(async (timeLog: ITrackedTime, action: string) => {
        if (action === "DELETE") await timeLogActions[action]!(timeLog)
    }, [])

    const renderQuickActions = useCallback(
        (timeLog: ITrackedTime, customActionButton?: React.ReactElement, portalElement?: HTMLDivElement | null) => (
            <TimeLogQuickActions
                customActionButton={customActionButton}
                timeLog={timeLog}
                handleDelete={async () => handleTimeLog(timeLog, "DELETE")}
                portalElement={portalElement}
            />
        ),
        [handleTimeLog]
    )

    useEffect(() => {
        const currentContainerRef = containerRef.current
        if (currentContainerRef) currentContainerRef.addEventListener("scroll", handleScroll)
        return () => {
            if (currentContainerRef) currentContainerRef.removeEventListener("scroll", handleScroll)
        }
    }, [])

    return (
        <div className="relative flex flex-col h-full w-full overflow-x-hidden whitespace-nowrap rounded-lg bg-custom-background-200 text-custom-text-200">
            <div ref={portalRef} className="spreadsheet-menu-portal" />
            <div ref={containerRef} className="vertical-scrollbar horizontal-scrollbar scrollbar-lg h-full w-full">
                <table className="overflow-y-auto" onKeyDown={handleKeyBoardNavigation}>
                    <thead className="sticky top-0 left-0 z-[12] border-b-[0.5px] border-custom-border-100">
                        <tr>
                            <th
                                className="sticky left-0 z-[15] w-full h-11 flex items-center bg-custom-background-90 text-sm font-medium before:absolute before:h-full before:right-0 before:border-[0.5px]  before:border-custom-border-100"
                                tabIndex={-1}
                            >
                                <WithDisplayPropertiesHOC
                                    displayProperties={displayProperties}
                                    displayPropertyKey="issue_id"
                                >
                                    <span className="flex h-full w-full flex-shrink-0 items-center px-4 py-2.5">
                                        <span className="mr-1.5 text-custom-text-400">#</span>Issue ID
                                    </span>
                                </WithDisplayPropertiesHOC>
                            </th>
                            {TIMESHEET_PROPERTY_LIST.map((property) => (
                                <TimesheetTableHeadCell
                                    property={property}
                                    displayProperties={displayProperties}
                                    displayFilters={displayFilters}
                                />
                            ))}
                        </tr>
                    </thead>
                    {timesheet && timesheet.length > 0 && (
                        <tbody>
                            {timesheet.map((timeLog) => (
                                <TimeLogRow
                                    key={timeLog.id}
                                    timeLog={timeLog}
                                    quickActions={renderQuickActions}
                                    timesheet={timesheet}
                                    displayProperties={displayProperties}
                                    portalElement={portalRef}
                                    containerRef={containerRef}
                                    isScrolled={isScrolled}
                                />
                            ))}
                        </tbody>
                    )}
                </table>
            </div>
        </div>
    )
})

import { FC, MutableRefObject, useRef, useState } from "react"

import { MoreHorizontal } from "lucide-react"
import { observer } from "mobx-react-lite"

import RenderIfVisible from "@components/core/render-if-visible-HOC"
import { WithDisplayPropertiesHOC } from "@components/time-tracker"

import useOutsideClickDetector from "@hooks/use-outside-click-detector"

import { cn } from "@helpers/common.helper"

import { ITimesheetDisplayPropertyOptions, ITrackedTime } from "@servcy/types"

interface ITimeLogRow {
    timeLog: ITrackedTime
    timesheet: ITrackedTime[]
    displayProperties: ITimesheetDisplayPropertyOptions
    portalElement: React.MutableRefObject<HTMLDivElement | null>
    isScrolled: MutableRefObject<boolean>
    containerRef: MutableRefObject<HTMLTableElement | null>
}

export const TimeLogRow: FC<ITimeLogRow> = observer((props) => {
    const { timeLog, timesheet, containerRef, displayProperties, portalElement, isScrolled } = props
    const [isMenuActive, setIsMenuActive] = useState(false)
    const menuActionRef = useRef<HTMLDivElement | null>(null)
    useOutsideClickDetector(menuActionRef, () => setIsMenuActive(false))
    const customActionButton = (
        <div
            ref={menuActionRef}
            className={`w-full cursor-pointer rounded p-1 text-custom-sidebar-text-400 hover:bg-custom-background-80 ${
                isMenuActive ? "bg-custom-background-80 text-custom-text-100" : "text-custom-text-200"
            }`}
            onClick={() => setIsMenuActive(!isMenuActive)}
        >
            <MoreHorizontal className="h-3.5 w-3.5" />
        </div>
    )
    return (
        <RenderIfVisible
            as="tr"
            defaultHeight="calc(2.75rem - 1px)"
            root={containerRef}
            placeholderChildren={<td colSpan={100} className="border-b-[0.5px] border-custom-border-200" />}
            changingReference={timesheet}
        >
            <td
                id={`time-log-${timeLog.id}`}
                className={cn(
                    "sticky group left-0 h-11 w-full flex items-center bg-custom-background-100 text-sm after:absolute border-r-[0.5px] z-10 border-custom-border-200",
                    {
                        "shadow-[8px_22px_22px_10px_rgba(0,0,0,0.05)]": isScrolled.current,
                    }
                )}
                tabIndex={0}
            >
                <WithDisplayPropertiesHOC displayProperties={displayProperties} displayPropertyKey="issue_id">
                    <div className="flex min-w-min items-center gap-1.5 px-4 py-2.5 pr-0">
                        <div className="relative flex cursor-pointer items-center text-center text-xs hover:text-custom-text-100">
                            <span
                                className={`flex items-center justify-center font-medium  group-hover:opacity-0 ${
                                    isMenuActive ? "opacity-0" : "opacity-100"
                                }`}
                            >
                                {timeLog.project_detail.identifier}-{timeLog.issue_detail.sequence_id}
                            </span>
                            <div
                                className={`absolute left-2.5 top-0 hidden group-hover:block ${
                                    isMenuActive ? "!block" : ""
                                }`}
                            >
                                {/* {quickActions(issueDetail, customActionButton, portalElement.current)} */}
                            </div>
                        </div>
                    </div>
                </WithDisplayPropertiesHOC>
            </td>
        </RenderIfVisible>
    )
})

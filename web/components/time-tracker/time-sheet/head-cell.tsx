import { useRef } from "react"

import { observer } from "mobx-react"

import { WithDisplayPropertiesHOC } from "@components/time-tracker"

import { TIMESHEET_PROPERTY_DETAILS } from "@constants/timesheet"

import { ITimesheetDisplayFilterOptions, ITimesheetDisplayPropertyOptions } from "@servcy/types"

interface Props {
    property: keyof ITimesheetDisplayPropertyOptions
    displayProperties: ITimesheetDisplayPropertyOptions
    displayFilters: ITimesheetDisplayFilterOptions
}

export const TimesheetTableHeadCell = observer((props: Props) => {
    const { property, displayProperties } = props
    const tableHeaderCellRef = useRef<HTMLTableCellElement | null>(null)
    const propertyDetails = TIMESHEET_PROPERTY_DETAILS[property]
    return (
        <WithDisplayPropertiesHOC displayProperties={displayProperties} displayPropertyKey={property}>
            <th
                className={`h-11 items-center bg-custom-background-90 text-sm font-medium px-4 py-1 border border-b-0 border-t-0 border-custom-border-100 ${propertyDetails?.width ?? "min-w-[8rem] w-full"}`}
                ref={tableHeaderCellRef}
                tabIndex={0}
            >
                <div className="flex w-full items-center justify-between gap-1.5 py-2 text-sm text-custom-text-200 hover:text-custom-text-100">
                    <div className="flex items-center gap-1.5">
                        <propertyDetails.icon className="h-4 w-4 text-custom-text-400" />
                        {propertyDetails?.title}
                    </div>
                </div>
            </th>
        </WithDisplayPropertiesHOC>
    )
})

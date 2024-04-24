import { useRef } from "react"

import {
    ArrowDownWideNarrow,
    ArrowUpNarrowWide,
    CheckIcon,
    ChevronDownIcon,
    Eraser,
    ListFilter,
    MoveRight,
} from "lucide-react"
import { observer } from "mobx-react"

import { WithDisplayPropertiesHOC } from "@components/time-tracker"

import useLocalStorage from "@hooks/use-local-storage"

import { TIMESHEET_PROPERTY_DETAILS } from "@constants/timesheet"

import {
    ITimesheetDisplayFilterOptions,
    ITimesheetDisplayPropertyOptions,
    TTimesheetOrderByOptions,
} from "@servcy/types"
import { CustomMenu } from "@servcy/ui"

interface Props {
    property: keyof ITimesheetDisplayPropertyOptions
    displayProperties: ITimesheetDisplayPropertyOptions
    displayFilters: ITimesheetDisplayFilterOptions
    handleDisplayFilterUpdate: (data: Partial<ITimesheetDisplayFilterOptions>) => void
}

export const TimesheetTableHeadCell = observer((props: Props) => {
    const { displayFilters, property, handleDisplayFilterUpdate, displayProperties } = props
    const tableHeaderCellRef = useRef<HTMLTableCellElement | null>(null)
    const { storedValue: selectedMenuItem, setValue: setSelectedMenuItem } = useLocalStorage("timesheetViewSorting", "")
    const { storedValue: activeSortingProperty, setValue: setActiveSortingProperty } = useLocalStorage(
        "timesheetViewActiveSortingProperty",
        ""
    )
    const propertyDetails = TIMESHEET_PROPERTY_DETAILS[property]
    const handleOrderBy = (order: TTimesheetOrderByOptions, itemKey: string) => {
        handleDisplayFilterUpdate({ order_by: order })
        setSelectedMenuItem(`${order}_${itemKey}`)
        setActiveSortingProperty(order === "-created_at" ? "" : itemKey)
    }
    const onClose = () => {
        tableHeaderCellRef?.current?.focus()
    }
    return (
        <WithDisplayPropertiesHOC displayProperties={displayProperties} displayPropertyKey={property}>
            <th
                className="h-11 w-full min-w-[8rem] items-center bg-custom-background-90 text-sm font-medium px-4 py-1 border border-b-0 border-t-0 border-custom-border-100"
                ref={tableHeaderCellRef}
                tabIndex={0}
            >
                <CustomMenu
                    customButtonClassName="clickable !w-full"
                    customButtonTabIndex={-1}
                    className="!w-full"
                    customButton={
                        <div className="flex w-full cursor-pointer items-center justify-between gap-1.5 py-2 text-sm text-custom-text-200 hover:text-custom-text-100">
                            <div className="flex items-center gap-1.5">
                                <propertyDetails.icon className="h-4 w-4 text-custom-text-400" />
                                {propertyDetails?.title}
                            </div>
                            <div className="ml-3 flex">
                                {activeSortingProperty === property && (
                                    <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full">
                                        <ListFilter className="h-3 w-3" />
                                    </div>
                                )}
                                <ChevronDownIcon className="h-3 w-3" aria-hidden="true" />
                            </div>
                        </div>
                    }
                    onMenuClose={onClose}
                    placement="bottom-start"
                    closeOnSelect
                >
                    <CustomMenu.MenuItem onClick={() => handleOrderBy(propertyDetails?.ascendingOrderKey, property)}>
                        <div
                            className={`flex items-center justify-between gap-1.5 px-1 ${
                                selectedMenuItem === `${propertyDetails?.ascendingOrderKey}_${property}`
                                    ? "text-custom-text-100"
                                    : "text-custom-text-200 hover:text-custom-text-100"
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <ArrowDownWideNarrow className="h-3 w-3 stroke-[1.5]" />
                                <span>{propertyDetails?.ascendingOrderTitle}</span>
                                <MoveRight className="h-3 w-3" />
                                <span>{propertyDetails?.descendingOrderTitle}</span>
                            </div>

                            {selectedMenuItem === `${propertyDetails?.ascendingOrderKey}_${property}` && (
                                <CheckIcon className="h-3 w-3" />
                            )}
                        </div>
                    </CustomMenu.MenuItem>
                    <CustomMenu.MenuItem onClick={() => handleOrderBy(propertyDetails?.descendingOrderKey, property)}>
                        <div
                            className={`flex items-center justify-between gap-1.5 px-1 ${
                                selectedMenuItem === `${propertyDetails?.descendingOrderKey}_${property}`
                                    ? "text-custom-text-100"
                                    : "text-custom-text-200 hover:text-custom-text-100"
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <ArrowUpNarrowWide className="h-3 w-3 stroke-[1.5]" />
                                <span>{propertyDetails?.descendingOrderTitle}</span>
                                <MoveRight className="h-3 w-3" />
                                <span>{propertyDetails?.ascendingOrderTitle}</span>
                            </div>

                            {selectedMenuItem === `${propertyDetails?.descendingOrderKey}_${property}` && (
                                <CheckIcon className="h-3 w-3" />
                            )}
                        </div>
                    </CustomMenu.MenuItem>
                    {selectedMenuItem &&
                        selectedMenuItem !== "" &&
                        displayFilters?.order_by !== "-created_at" &&
                        selectedMenuItem.includes(property) && (
                            <CustomMenu.MenuItem
                                className={`mt-0.5 ${selectedMenuItem === `-created_at_${property}` ? "bg-custom-background-80" : ""}`}
                                key={property}
                                onClick={() => handleOrderBy("-created_at", property)}
                            >
                                <div className="flex items-center gap-2 px-1">
                                    <Eraser className="h-3 w-3" />
                                    <span>Clear sorting</span>
                                </div>
                            </CustomMenu.MenuItem>
                        )}
                </CustomMenu>
            </th>
        </WithDisplayPropertiesHOC>
    )
})

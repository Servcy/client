import React from "react"

import { observer } from "mobx-react-lite"

import {
    FilterApprovalType,
    FilterBillableType,
    FilterDisplayProperties,
    FilterManualTrackedType,
} from "@components/time-tracker"

import { ITimesheetDisplayFilterOptions, ITimesheetDisplayPropertyOptions } from "@servcy/types"

type Props = {
    displayFilters: ITimesheetDisplayFilterOptions
    displayProperties: ITimesheetDisplayPropertyOptions
    handleDisplayFiltersUpdate: (updatedDisplayFilter: Partial<ITimesheetDisplayFilterOptions>) => void
    handleDisplayPropertiesUpdate: (updatedDisplayProperties: Partial<ITimesheetDisplayPropertyOptions>) => void
}

export const TimesheetDisplayFiltersSelection: React.FC<Props> = observer((props) => {
    const { displayFilters, displayProperties, handleDisplayFiltersUpdate, handleDisplayPropertiesUpdate } = props

    return (
        <div className="relative h-full w-full divide-y divide-custom-border-200 overflow-hidden overflow-y-auto px-2.5">
            <div className="py-2">
                <FilterDisplayProperties
                    displayProperties={displayProperties}
                    handleUpdate={handleDisplayPropertiesUpdate}
                />
            </div>
            <div className="py-2">
                <FilterBillableType
                    is_billable={displayFilters.is_billable}
                    handleUpdate={(val?: boolean) =>
                        handleDisplayFiltersUpdate({
                            is_billable: val,
                        })
                    }
                />
            </div>
            <div className="py-2">
                <FilterApprovalType
                    is_approved={displayFilters.is_approved}
                    handleUpdate={(val?: boolean) =>
                        handleDisplayFiltersUpdate({
                            is_approved: val,
                        })
                    }
                />
            </div>
            <div className="py-2">
                <FilterManualTrackedType
                    is_manually_added={displayFilters.is_manually_added}
                    handleUpdate={(val?: boolean) =>
                        handleDisplayFiltersUpdate({
                            is_manually_added: val,
                        })
                    }
                />
            </div>
        </div>
    )
})

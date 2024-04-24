import { FC } from "react"

import {
    AudioLines,
    CalendarCheck2,
    CalendarClock,
    Camera,
    Check,
    CircleUser,
    DollarSign,
    PlusCircle,
    Text,
} from "lucide-react"

// import {
//     TimesheetApprovedColumn,
//     TimesheetBillableColumn,
//     TimesheetCreatorColumn,
//     TimesheetDescriptionColumn,
//     TimesheetDurationColumn,
//     TimesheetEndedAtColumn,
//     TimesheetManuallyAddedColumn,
//     TimesheetSnapshotsColumn,
//     TimesheetStartedAtColumn,
// } from "@components/time-tracker"

import { ITimesheetDisplayPropertyOptions, TTimesheetOrderByOptions } from "@servcy/types"
import { ISvgIcons } from "@servcy/ui/src/icons/type"

export const TIMESHEET_PROPERTY_LIST: (keyof ITimesheetDisplayPropertyOptions)[] = [
    "description",
    "duration",
    "start_time",
    "end_time",
    "created_by",
    "is_billable",
    "is_approved",
    "snapshots_count",
    "is_manually_added",
]

export enum ETimesheetFilterType {
    FILTERS = "filters",
    DISPLAY_FILTERS = "displayFilters",
    DISPLAY_PROPERTIES = "displayProperties",
}

export const TIMESHEET_DISPLAY_PROPERTIES: {
    key: keyof ITimesheetDisplayPropertyOptions
    title: string
}[] = [
    { key: "issue_id", title: "Issue id" },
    { key: "description", title: "Description" },
    { key: "duration", title: "Duration" },
    { key: "start_time", title: "Start Time" },
    { key: "end_time", title: "End Time" },
    { key: "created_by", title: "Created By" },
    { key: "is_billable", title: "Billable" },
    { key: "is_approved", title: "Approved" },
    { key: "snapshots_count", title: "Snapshots" },
    { key: "is_manually_added", title: "Manually Added" },
]

export const TIMESHEET_PROPERTY_DETAILS: {
    [key: string]: {
        title: string
        icon: FC<ISvgIcons>
        // Column: React.FC<{
        //     trackedTime: ITrackedTime
        //     onClose: () => void
        //     onChange: (trackedTime: ITrackedTime, data: Partial<ITrackedTime>, updates: any) => void // eslint-disable-line
        //     disabled: boolean
        // }>
    }
} = {
    description: {
        title: "Description",
        icon: Text,
        // Column: TimesheetDescriptionColumn,
    },
    duration: {
        title: "Duration",
        icon: AudioLines,
        // column: TimesheetDurationColumn,
    },
    start_time: {
        title: "Start Time",
        icon: CalendarClock,
        // Column: TimesheetStartedAtColumn,
    },
    end_time: {
        title: "End Time",
        icon: CalendarCheck2,
        // Column: TimesheetEndedAtColumn,
    },
    created_by: {
        title: "Creator",
        icon: CircleUser,
        // Column: TimesheetCreatorColumn,
    },
    is_billable: {
        title: "Billable",
        icon: DollarSign,
        // Column: TimesheetBillableColumn,
    },
    is_approved: {
        title: "Approved",
        icon: Check,
        // Column: TimesheetApprovedColumn,
    },
    snapshots_count: {
        title: "Snapshots",
        icon: Camera,
        // Column: TimesheetSnapshotsColumn,
    },
    is_manually_added: {
        title: "Manually Added",
        icon: PlusCircle,
        // Column: TimesheetManuallyAddedColumn,
    },
}

export type ITimesheetFilters = {
    created_by?: string[] | null
    project?: string[] | null
    start_time?: string[] | null
}

export type ITimesheetDisplayFilters = {
    is_billable?: boolean
    is_approved?: boolean
    is_manually_added?: boolean
}

export type ITimesheetParams =
    | "created_by"
    | "project"
    | "start_time"
    | "is_billable"
    | "is_approved"
    | "is_manually_added"

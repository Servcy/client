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

export type ITimesheetParams = "created_by" | "project" | "start_time"

export type TTimesheetOrderByOptions =
    | "-created_at"
    | "created_at"
    | "updated_at"
    | "-updated_at"
    | "description"
    | "-description"
    | "duration"
    | "-duration"
    | "start_time"
    | "-start_time"
    | "end_time"
    | "-end_time"
    | "created_by__first_name"
    | "-created_by__first_name"
    | "is_billable"
    | "-is_billable"
    | "is_approved"
    | "-is_approved"
    | "snapshots_count"
    | "-snapshots_count"
    | "is_manually_added"
    | "-is_manually_added"

export interface ITimesheetDisplayProperties {
    issue_id?: boolean
    description?: boolean
    duration?: boolean
    start_time?: boolean
    end_time?: boolean
    created_by?: boolean
    is_billable?: boolean
    is_approved?: boolean
    snapshots_count?: boolean
    is_manually_added?: boolean
}

export interface ITrackedTime {
    id: string

    issue: string
    project: string
    workspace: string

    description: string

    start_time: string
    end_time: string

    is_billable: boolean
    is_approved: boolean

    created_at: string
    updated_at: string
    created_by: string
    updated_by: string
}

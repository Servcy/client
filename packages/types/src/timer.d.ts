export interface ITrackedTime {
    id: string

    issue_id: string
    project_id: string
    workspace_id: string

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

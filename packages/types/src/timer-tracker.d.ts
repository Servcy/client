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

    issue_detail: {
        id: string
        name: string
        sequence_id: number
    }
    project_detail: {
        id: string
        identifier: string
    }

    created_at: string
    updated_at: string
    created_by: string
    updated_by: string
}

export type ITrackedTimeSnapshot = {
    id: string
    meta_data: {
        name: string
        size: number
    }
    file: string
    tracked_time: ITrackedTime

    created_at: string
    updated_at: string
    created_by: string
    updated_by: string
}

export interface IWorkspaceSubscription {
    id: number
    workspace: string
    plan_details: {
        name: string
    }
    is_active: boolean
    limits: {
        invitations: number
    }
    created_at: Date
    created_by: string
    updated_at: Date
    updated_by: string
}

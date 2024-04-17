export interface IWorkspaceSubscription {
    id: number
    workspace: string
    plan_details: {
        name: string
    }
    subscription_details: object
    is_active: boolean
    limits: {
        invitations: number
    }
    created_at: Date
    created_by: string
    updated_at: Date
    updated_by: string
}

export interface IRazorpayPlanDetails {
    id: string
    active: boolean
    name: string
    description: string
    amount: number
    unit_amount: number
    currency: string
    type: string
    unit: number
    tax_inclusive: boolean
    hsn_code: number
    sac_code: number
    tax_rate: number
    tax_id: number
    tax_group_id: number
    created_at: number
    updated_at: number
}

export interface IRazorpayPlan {
    id: string
    entity: string
    interval: number
    period: string
    item: RazorpayPlanDetails
    created_at: number
}

export interface IRazorpayPlans {
    entity: string
    count: number
    items: IRazorpayPlan[]
}

export interface IRazorpaySubscription {
    id: string
    entity: string
    plan_id: string
    status: string
    current_start: number
    current_end: number
    ended_at: number
    quantity: number
    charge_at: number
    start_at: number
    end_at: number
    auth_attempts: number
    total_count: number
    paid_count: number
    customer_notify: boolean
    created_at: number
    expire_by: number
    short_url: string
    has_scheduled_changes: boolean
    change_scheduled_at: number
    source: string
    offer_id: string
    remaining_count: number
}

export interface IWorkspaceSubscription {
    id: number
    workspace: string
    plan_details: {
        name: string
    }
    subscription_details: object
    is_active: boolean
    valid_till: Date
    limits: {
        invitations: number
    }
    created_at: Date
    created_by: string
    updated_at: Date
    updated_by: string
}

export interface RazorpayPlanDetails {
    id: string
    active: true
    name: string
    description: string
    amount: number
    unit_amount: number
    currency: string
    type: string
    unit: null
    tax_inclusive: false
    hsn_code: null
    sac_code: null
    tax_rate: null
    tax_id: null
    tax_group_id: null
    created_at: number
    updated_at: number
}

export interface RazorpayPlan {
    id: string
    entity: string
    interval: number
    period: string
    item: RazorpayPlanDetails
    created_at: number
}

export interface RazorpayPlans {
    entity: string
    count: number
    items: RazorpayPlan[]
}

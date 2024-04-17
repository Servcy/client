import { APIService } from "@services/api.service"

import { API_BASE_URL } from "@helpers/common.helper"

import { IWorkspaceSubscription, RazorpayPlans } from "@servcy/types"

export class BillingService extends APIService {
    constructor() {
        super(API_BASE_URL)
    }

    async fetchWorkspaceSubscription(workspaceSlug: string): Promise<IWorkspaceSubscription> {
        return this.get(`/billing/${workspaceSlug}/subscription`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response
            })
    }

    async fetchRazorpayPlans(workspaceSlug: string): Promise<RazorpayPlans> {
        return this.get(`/billing/${workspaceSlug}/razorpay`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response
            })
    }
}

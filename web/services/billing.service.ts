import { APIService } from "@services/api.service"

import { API_BASE_URL } from "@helpers/common.helper"

import { IRazorpayPlans, IWorkspaceSubscription } from "@servcy/types"

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

    async fetchRazorpayPlans(workspaceSlug: string): Promise<IRazorpayPlans> {
        return this.get(`/billing/${workspaceSlug}/razorpay`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response
            })
    }

    async createRazorpaySubscription(workspaceSlug: string, planId: string): Promise<any> {
        return this.post(`/billing/${workspaceSlug}/razorpay`, { planId })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response
            })
    }
}

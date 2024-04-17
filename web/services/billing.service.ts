import { APIService } from "@services/api.service"

import { API_BASE_URL } from "@helpers/common.helper"

import { IRazorpayPlans, IRazorpaySubscription, IWorkspaceSubscription } from "@servcy/types"

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

    async createRazorpaySubscription(workspaceSlug: string, planId: string): Promise<IRazorpaySubscription> {
        return this.post(`/billing/${workspaceSlug}/razorpay`, { plan_id: planId })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response
            })
    }

    async validateRazorpayPayment(
        workspaceSlug: string,
        paymentId: string,
        signature: string,
        subscriptionId: string
    ): Promise<IRazorpaySubscription> {
        return this.patch(`/billing/${workspaceSlug}/razorpay`, {
            workspace_slug: workspaceSlug,
            payment_id: paymentId,
            signature,
            subscription_id: subscriptionId,
        })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response
            })
    }
}

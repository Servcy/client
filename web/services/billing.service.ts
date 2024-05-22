import { APIService } from "@services/api.service"

import { API_BASE_URL } from "@helpers/common.helper"

import { IWorkspaceSubscription } from "@servcy/types"

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

    cancelSubscription(workspaceSlug: string): Promise<void> {
        return this.delete(`/billing/${workspaceSlug}/subscription`)
            .then(() => {})
            .catch((error) => {
                throw error?.response
            })
    }

    pauseSubscription(workspaceSlug: string): Promise<void> {
        return this.put(`/billing/${workspaceSlug}/subscription`)
            .then(() => {})
            .catch((error) => {
                throw error?.response
            })
    }
}

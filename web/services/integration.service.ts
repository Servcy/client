import { APIService } from "@services/api.service"

import { API_BASE_URL } from "@helpers/common.helper"

class IntegrationService extends APIService {
    constructor() {
        super(API_BASE_URL)
    }

    async fetchIntegrations() {
        const response = await this.get("/integration/fetch")
        return response.data.results
    }

    async fetchUserIntegrations(integration_name: string) {
        const response = await this.get(`/integration/user?integration_name=${integration_name}`)
        return response.data.results
    }

    async disconnectUserIntegration(integration_id: string) {
        const response = await this.post("/integration/user", {
            integration_id,
        })
        return response.data.results
    }

    async fetchIntegrationEvents(integration_id: string) {
        const response = await this.get(`/integration/event/fetch?integration_id=${integration_id}`)
        return response.data.results
    }

    async configureUserIntegration(id: number, configuration: object, integration_name: string) {
        const response = await this.put(`/integration/user/${id}?integration_name=${integration_name}`, {
            configuration,
        })
        return response
    }

    async integrationOauth(payload: object, slug: string) {
        const response = await this.put(`/integration/oauth/${slug}`, payload)
        return response?.data
    }

    async enableIntegrationEvent(payload: object) {
        const response = await this.post("/integration/event/enable", payload)
        return response
    }

    async disableIntegrationEvent(payload: object) {
        const response = await this.post("/integration/event/disable", payload)
        return response
    }

    async disableNotificationType(payload: object) {
        const response = await this.post("/integration/event/notification", payload)
        return response
    }
}

export default IntegrationService

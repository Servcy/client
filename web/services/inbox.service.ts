import { APIService } from "@services/api.service"

import { API_BASE_URL } from "@helpers/common.helper"

class InboxService extends APIService {
    constructor() {
        super(API_BASE_URL)
    }

    async fetchInbox(payload: object): Promise<any> {
        const response = await this.post("/inbox/items", payload)
        return response
    }

    async archiveItems(payload: object): Promise<any> {
        const response = await this.post("/inbox/archive", payload)
        return response
    }

    async readItem(payload: object): Promise<any> {
        const response = await this.post("/inbox/read", payload)
        return response
    }

    async deleteItems(payload: object): Promise<any> {
        const response = await this.post("/inbox/delete", payload)
        return response
    }

    async generateReply(payload: object): Promise<any> {
        const response = await this.post("/inbox/assisstant/generate-reply", payload)
        return response
    }
}

export default InboxService

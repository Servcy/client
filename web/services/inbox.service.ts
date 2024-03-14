import { APIService } from "@services/api.service"

import { API_BASE_URL } from "@helpers/common.helper"

class InboxService extends APIService {
    constructor() {
        super(API_BASE_URL)
    }

    async fetchInbox(payload: object): Promise<any> {
        const response = await this.post("/inbox/fetch", payload)
        return response?.data
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
}

export default InboxService

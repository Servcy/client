import { APIService } from "@services/api.service"

import { API_BASE_URL } from "@helpers/common.helper"

import type { ITrackedTime } from "@servcy/types"

export class TimeTrackerService extends APIService {
    constructor() {
        super(API_BASE_URL)
    }

    async startIssueTimer(workspaceSlug: string, projectId: string, issueId: string, data: Partial<ITrackedTime>) {
        const response = await this.post(`/project/${workspaceSlug}/${projectId}/${issueId}/start-timer`, data)
        return response.data.results
    }
}

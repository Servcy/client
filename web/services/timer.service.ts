import { APIService } from "@services/api.service"

import { API_BASE_URL } from "@helpers/common.helper"

import type { ITrackedTime } from "@servcy/types"

export class TimeTrackerService extends APIService {
    constructor() {
        super(API_BASE_URL)
    }

    async startIssueTimer(workspaceSlug: string, projectId: string, issueId: string, data: Partial<ITrackedTime>) {
        return this.post(`/project/${workspaceSlug}/${projectId}/${issueId}/start-timer`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }
}

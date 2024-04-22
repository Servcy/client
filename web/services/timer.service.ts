import { APIService } from "@services/api.service"

import { API_BASE_URL } from "@helpers/common.helper"

import type { ITrackedTime } from "@servcy/types"

export class TimeTrackerService extends APIService {
    constructor() {
        super(API_BASE_URL)
    }

    async startIssueTimer(workspaceSlug: string, projectId: string, issueId: string, data: Partial<ITrackedTime>) {
        try {
            const response = await this.post(`/project/${workspaceSlug}/${projectId}/${issueId}/start-timer`, data)
            return response?.data
        } catch (error) {
            throw error
        }
    }

    async stopIssueTimer(workspaceSlug: string, projectId: string, timerId: string) {
        try {
            const response = await this.post(`/project/${workspaceSlug}/${projectId}/${timerId}/stop-timer`)
            return response?.data
        } catch (error) {
            throw error
        }
    }

    async fetchTimeSheet(workspaceSlug: string, queries?: any) {
        try {
            const response = await this.get(`/project/${workspaceSlug}/timer`, {
                params: queries,
            })
            return response?.data
        } catch (error) {
            throw error
        }
    }

    async isTimerRunning(workspaceSlug: string) {
        try {
            const response = await this.get(`/project/${workspaceSlug}/is-timer-running`)
            return response?.data
        } catch (error) {
            throw error
        }
    }
}

import { APIService } from "@services/api.service"

import { API_BASE_URL } from "@helpers/common.helper"

import type { ITrackedTime, ITrackedTimeSnapshot } from "@servcy/types"

export class TimeTrackerService extends APIService {
    constructor() {
        super(API_BASE_URL)
    }

    async startTrackingTime(
        workspaceSlug: string,
        projectId: string,
        issueId: string,
        data: Partial<ITrackedTime>
    ): Promise<ITrackedTime> {
        try {
            const response = await this.post(`/project/${workspaceSlug}/${projectId}/${issueId}/start-timer`, data)
            return response?.data
        } catch (error) {
            throw error
        }
    }

    async stopTrackingTime(workspaceSlug: string, projectId: string, timerId: string): Promise<ITrackedTime> {
        try {
            const response = await this.post(`/project/${workspaceSlug}/${projectId}/${timerId}/stop-timer`)
            return response?.data
        } catch (error) {
            throw error
        }
    }

    async fetchTimeSheet(workspaceSlug: string, viewId: string, queries?: any): Promise<ITrackedTime[]> {
        try {
            const response = await this.get(`/project/${workspaceSlug}/timer/${viewId}`, {
                params: queries,
            })
            return response?.data
        } catch (error) {
            throw error
        }
    }

    async isTimerRunning(workspaceSlug: string): Promise<ITrackedTime> {
        try {
            const response = await this.get(`/project/${workspaceSlug}/is-timer-running`)
            return response?.data
        } catch (error) {
            throw error
        }
    }

    async uploadTimeTrackedSnapshot(timeTrackedId: string, file: FormData): Promise<ITrackedTimeSnapshot> {
        return this.post(`/project/${timeTrackedId}/tracked-time-snapshot`, file, {
            headers: {
                ...this.getHeaders(),
                "Content-Type": "multipart/form-data",
            },
        })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getTimeTrackedSnapshot(timeTrackedId: string): Promise<ITrackedTimeSnapshot[]> {
        return this.get(`/project/${timeTrackedId}/tracked-time-snapshot`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async deleteTimeTrackedSnapshot(timeTrackedId: string, snapshotId: string): Promise<ITrackedTimeSnapshot> {
        return this.delete(`/project/${timeTrackedId}/tracked-time-snapshot/${snapshotId}`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }
}

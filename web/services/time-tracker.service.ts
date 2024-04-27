import { APIService } from "@services/api.service"

import { API_BASE_URL } from "@helpers/common.helper"

import type { IMemberWiseTimesheetDuration, ITrackedTime, ITrackedTimeSnapshot } from "@servcy/types"

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

    async updateTimeLog(
        workspaceSlug: string,
        projectId: string,
        timerId: string,
        data: Partial<ITrackedTime>
    ): Promise<ITrackedTime> {
        try {
            const response = await this.patch(`/project/${workspaceSlug}/${projectId}/${timerId}/update-time-log`, data)
            return response?.data
        } catch (error) {
            throw error
        }
    }

    async deleteTimeLog(workspaceSlug: string, projectId: string, timerId: string): Promise<ITrackedTime> {
        try {
            const response = await this.delete(`/project/${workspaceSlug}/${projectId}/${timerId}/delete-time-log`)
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
            if (response?.status === 204) throw new Error("Timer is not running")
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

    async fetchProjectMemberWiseTimeLogged(
        workspaceSlug: string,
        projectId: string
    ): Promise<IMemberWiseTimesheetDuration[]> {
        return this.get(`/project/${workspaceSlug}/${projectId}/member-wise-time-logged`)
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

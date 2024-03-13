import { APIService } from "@services/api.service"

import { API_BASE_URL } from "@helpers/common.helper"

import {
    IAnalyticsParams,
    IAnalyticsResponse,
    IDefaultAnalyticsResponse,
    IExportAnalyticsFormData,
} from "@servcy/types"

export class AnalyticsService extends APIService {
    constructor() {
        super(API_BASE_URL)
    }

    async getAnalytics(workspaceSlug: string, params: IAnalyticsParams): Promise<IAnalyticsResponse> {
        return this.get(`/dashboard/workspaces/${workspaceSlug}/analytics`, {
            params: {
                ...params,
                project: params?.project ? params.project.toString() : null,
            },
        })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getDefaultAnalytics(
        workspaceSlug: string,
        params?: Partial<IAnalyticsParams>
    ): Promise<IDefaultAnalyticsResponse> {
        return this.get(`/dashboard/workspaces/${workspaceSlug}/analytics/default`, {
            params: {
                ...params,
                project: params?.project ? params.project.toString() : null,
            },
        })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async exportAnalytics(workspaceSlug: string, data: IExportAnalyticsFormData): Promise<any> {
        return this.post(`/dashboard/workspaces/${workspaceSlug}/analytics/export`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }
}

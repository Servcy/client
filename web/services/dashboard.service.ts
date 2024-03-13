import { APIService } from "@services/api.service"

import { API_BASE_URL } from "@helpers/common.helper"

import { THomeDashboardResponse, TWidget, TWidgetStatsRequestParams, TWidgetStatsResponse } from "@servcy/types"

export class DashboardService extends APIService {
    constructor() {
        super(API_BASE_URL)
    }

    async getHomeDashboardWidgets(workspaceSlug: string): Promise<THomeDashboardResponse> {
        return this.get(`/dashboard/${workspaceSlug}`, {
            params: {
                dashboard_type: "home",
            },
        })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getWidgetStats(
        workspaceSlug: string,
        dashboardId: string,
        params: TWidgetStatsRequestParams
    ): Promise<TWidgetStatsResponse> {
        return this.get(`/dashboard/${workspaceSlug}/${dashboardId}`, {
            params,
        })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async updateDashboardWidget(dashboardId: string, widgetId: string, data: Partial<TWidget>): Promise<TWidget> {
        return this.patch(`/dashboard/${dashboardId}/widgets/${widgetId}`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }
}

import { APIService } from "@services/api.service"

import { API_BASE_URL } from "@helpers/common.helper"

import { IProjectView } from "@servcy/types"

export class ViewService extends APIService {
    constructor() {
        super(API_BASE_URL)
    }

    async createView(workspaceSlug: string, projectId: string, data: Partial<IProjectView>): Promise<any> {
        return this.post(`/project/${workspaceSlug}/${projectId}/views/`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async patchView(
        workspaceSlug: string,
        projectId: string,
        viewId: string,
        data: Partial<IProjectView>
    ): Promise<any> {
        return this.patch(`/project/${workspaceSlug}/${projectId}/views/${viewId}/`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async deleteView(workspaceSlug: string, projectId: string, viewId: string): Promise<any> {
        return this.delete(`/project/${workspaceSlug}/${projectId}/views/${viewId}/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getViews(workspaceSlug: string, projectId: string): Promise<IProjectView[]> {
        return this.get(`/project/${workspaceSlug}/${projectId}/views/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getViewDetails(workspaceSlug: string, projectId: string, viewId: string): Promise<IProjectView> {
        return this.get(`/project/${workspaceSlug}/${projectId}/views/${viewId}/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async addViewToFavorites(
        workspaceSlug: string,
        projectId: string,
        data: {
            view: string
        }
    ): Promise<any> {
        return this.post(`/project/${workspaceSlug}/${projectId}/favorite-view/`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async removeViewFromFavorites(workspaceSlug: string, projectId: string, viewId: string): Promise<any> {
        return this.delete(`/project/${workspaceSlug}/${projectId}/views/${viewId}/favorite/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }
}

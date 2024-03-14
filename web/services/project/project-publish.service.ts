import { APIService } from "@services/api.service"

import { IProjectPublishSettings } from "@store/project/project-publish.store"

import { API_BASE_URL } from "@helpers/common.helper"

export class ProjectPublishService extends APIService {
    constructor() {
        super(API_BASE_URL)
    }

    async getProjectSettingsAsync(workspaceSlug: string, projectId: string): Promise<any> {
        return this.get(`/project/${workspaceSlug}/${projectId}/project-deploy-boards/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response
            })
    }

    async createProjectSettingsAsync(
        workspaceSlug: string,
        projectId: string,
        data: IProjectPublishSettings
    ): Promise<any> {
        return this.post(`/project/${workspaceSlug}/${projectId}/project-deploy-boards/`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response
            })
    }

    async updateProjectSettingsAsync(
        workspaceSlug: string,
        projectId: string,
        project_publish_id: string,
        data: IProjectPublishSettings
    ): Promise<any> {
        return this.patch(`/project/${workspaceSlug}/${projectId}/project-deploy-boards/${project_publish_id}/`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response
            })
    }

    async deleteProjectSettingsAsync(
        workspaceSlug: string,
        projectId: string,
        project_publish_id: string
    ): Promise<any> {
        return this.delete(`/project/${workspaceSlug}/${projectId}/project-deploy-boards/${project_publish_id}/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response
            })
    }
}

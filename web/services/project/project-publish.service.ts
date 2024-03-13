import { APIService } from "@services/api.service"

import { IProjectPublishSettings } from "@store/project/project-publish.store"

import { API_BASE_URL } from "@helpers/common.helper"

export class ProjectPublishService extends APIService {
    constructor() {
        super(API_BASE_URL)
    }

    async getProjectSettingsAsync(workspaceSlug: string, project_slug: string): Promise<any> {
        return this.get(`/project/workspace/${workspaceSlug}/projects/${project_slug}/project-deploy-boards/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response
            })
    }

    async createProjectSettingsAsync(
        workspaceSlug: string,
        project_slug: string,
        data: IProjectPublishSettings
    ): Promise<any> {
        return this.post(`/project/workspace/${workspaceSlug}/projects/${project_slug}/project-deploy-boards/`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response
            })
    }

    async updateProjectSettingsAsync(
        workspaceSlug: string,
        project_slug: string,
        project_publish_id: string,
        data: IProjectPublishSettings
    ): Promise<any> {
        return this.patch(
            `/project/workspace/${workspaceSlug}/projects/${project_slug}/project-deploy-boards/${project_publish_id}/`,
            data
        )
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response
            })
    }

    async deleteProjectSettingsAsync(
        workspaceSlug: string,
        project_slug: string,
        project_publish_id: string
    ): Promise<any> {
        return this.delete(
            `/project/workspace/${workspaceSlug}/projects/${project_slug}/project-deploy-boards/${project_publish_id}/`
        )
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response
            })
    }
}

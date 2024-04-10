import { APIService } from "@services/api.service"

import { API_BASE_URL } from "@helpers/common.helper"

import type { IProjectTemplate } from "@servcy/types"

export class ProjectTemplateService extends APIService {
    constructor() {
        super(API_BASE_URL)
    }

    async getTemplate(workspaceSlug: string): Promise<any> {
        return this.get(`/project/${workspaceSlug}/project-template/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async patchTemplate(workspaceSlug: string, data: Partial<IProjectTemplate>): Promise<any> {
        return this.patch(`/project/${workspaceSlug}/project-template/`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }
}

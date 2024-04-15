import { APIService } from "@services/api.service"

import { API_BASE_URL } from "@helpers/common.helper"

import { IModule } from "@servcy/types"

export class ModuleArchiveService extends APIService {
    constructor() {
        super(API_BASE_URL)
    }

    async getArchivedModules(workspaceSlug: string, projectId: string): Promise<IModule[]> {
        return this.get(`/project/${workspaceSlug}/${projectId}/archived-modules/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async archiveModule(
        workspaceSlug: string,
        projectId: string,
        moduleId: string
    ): Promise<{
        archived_at: string
    }> {
        return this.post(`/project/${workspaceSlug}/${projectId}/modules/${moduleId}/archive/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async restoreModule(workspaceSlug: string, projectId: string, moduleId: string): Promise<void> {
        return this.delete(`/project/${workspaceSlug}/${projectId}/modules/${moduleId}/archive/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }
}

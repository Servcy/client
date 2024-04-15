import { APIService } from "@services/api.service"

import { API_BASE_URL } from "@helpers/common.helper"

export class ProjectArchiveService extends APIService {
    constructor() {
        super(API_BASE_URL)
    }

    async archiveProject(
        workspaceSlug: string,
        projectId: string
    ): Promise<{
        archived_at: string
    }> {
        return this.post(`/project/${workspaceSlug}/${projectId}/archive/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async restoreProject(workspaceSlug: string, projectId: string): Promise<void> {
        return this.delete(`/project/${workspaceSlug}/${projectId}/archive/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }
}

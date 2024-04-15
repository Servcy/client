import { APIService } from "@services/api.service"

import { API_BASE_URL } from "@helpers/common.helper"

import { ICycle } from "@servcy/types"

export class CycleArchiveService extends APIService {
    constructor() {
        super(API_BASE_URL)
    }

    async getArchivedCycles(workspaceSlug: string, projectId: string): Promise<ICycle[]> {
        return this.get(`/project/${workspaceSlug}/${projectId}/archived-cycles/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async archiveCycle(
        workspaceSlug: string,
        projectId: string,
        cycleId: string
    ): Promise<{
        archived_at: string
    }> {
        return this.post(`/project/${workspaceSlug}/${projectId}/cycles/${cycleId}/archive/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async restoreCycle(workspaceSlug: string, projectId: string, cycleId: string): Promise<void> {
        return this.delete(`/project/${workspaceSlug}/${projectId}/cycles/${cycleId}/archive/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }
}

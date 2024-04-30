import { APIService } from "@services/api.service"

import { API_BASE_URL } from "@helpers/common.helper"

import { IPage } from "@servcy/types"

export class PageService extends APIService {
    constructor() {
        super(API_BASE_URL)
    }

    async createPage(workspaceSlug: string, projectId: string, data: Partial<IPage>): Promise<IPage> {
        return this.post(`/project/${workspaceSlug}/${projectId}/pages/`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async patchPage(workspaceSlug: string, projectId: string, pageId: string, data: Partial<IPage>): Promise<IPage> {
        return this.patch(`/project/${workspaceSlug}/${projectId}/pages/${pageId}/`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async deletePage(workspaceSlug: string, projectId: string, pageId: string): Promise<any> {
        return this.delete(`/project/${workspaceSlug}/${projectId}/pages/${pageId}/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async addPageToFavorites(workspaceSlug: string, projectId: string, pageId: string): Promise<any> {
        return this.post(`/project/${workspaceSlug}/${projectId}/favorite-pages/`, {
            page: pageId,
        })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async removePageFromFavorites(workspaceSlug: string, projectId: string, pageId: string) {
        return this.delete(`/project/${workspaceSlug}/${projectId}/pages/${pageId}/favorite/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getProjectPages(workspaceSlug: string, projectId: string): Promise<IPage[]> {
        return this.get(`/project/${workspaceSlug}/${projectId}/pages/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getPagesWithParams(
        workspaceSlug: string,
        projectId: string,
        pageType: "all" | "favorite" | "private" | "shared"
    ): Promise<IPage[]> {
        return this.get(`/project/${workspaceSlug}/${projectId}/pages/`, {
            params: {
                page_view: pageType,
            },
        })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getPageDetails(workspaceSlug: string, projectId: string, pageId: string): Promise<IPage> {
        return this.get(`/project/${workspaceSlug}/${projectId}/pages/${pageId}/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    // =============== Archiving & Unarchiving Pages =================
    async archivePage(workspaceSlug: string, projectId: string, pageId: string): Promise<void> {
        return this.post(`/project/${workspaceSlug}/${projectId}/pages/${pageId}/archive/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async restorePage(workspaceSlug: string, projectId: string, pageId: string): Promise<void> {
        return this.post(`/project/${workspaceSlug}/${projectId}/pages/${pageId}/unarchive/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getArchivedPages(workspaceSlug: string, projectId: string): Promise<IPage[]> {
        return this.get(`/project/${workspaceSlug}/${projectId}/pages/archived/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error
            })
    }
    // ==================== Pages Locking Services ==========================
    async lockPage(workspaceSlug: string, projectId: string, pageId: string): Promise<any> {
        return this.post(`/project/${workspaceSlug}/${projectId}/pages/${pageId}/lock/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async unlockPage(workspaceSlug: string, projectId: string, pageId: string): Promise<any> {
        return this.post(`/project/${workspaceSlug}/${projectId}/pages/${pageId}/unlock/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }
}

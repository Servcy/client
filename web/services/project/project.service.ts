import { APIService } from "@services/api.service"

import { API_BASE_URL } from "@helpers/common.helper"

import type { IProject, ISearchIssueResponse, TProjectIssuesSearchParams } from "@servcy/types"

export class ProjectService extends APIService {
    constructor() {
        super(API_BASE_URL)
    }

    async createProject(workspaceSlug: string, data: Partial<IProject>): Promise<IProject> {
        return this.post(`/project/${workspaceSlug}/projects/`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response
            })
    }

    async checkProjectIdentifierAvailability(workspaceSlug: string, data: string): Promise<any> {
        return this.get(`/project/${workspaceSlug}/project-identifiers`, {
            params: {
                name: data,
            },
        })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getProjects(workspaceSlug: string): Promise<IProject[]> {
        return this.get(`/project/${workspaceSlug}/projects/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getProject(workspaceSlug: string, projectId: string): Promise<IProject> {
        return this.get(`/project/${workspaceSlug}/${projectId}/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async updateProject(workspaceSlug: string, projectId: string, data: Partial<IProject>): Promise<IProject> {
        return this.patch(`/project/${workspaceSlug}/${projectId}/`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async deleteProject(workspaceSlug: string, projectId: string): Promise<any> {
        return this.delete(`/project/${workspaceSlug}/${projectId}/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async setProjectView(
        workspaceSlug: string,
        projectId: string,
        data: {
            sort_order?: number
        }
    ): Promise<any> {
        await this.post(`/project/${workspaceSlug}/${projectId}/project-views/`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getUserProjectFavorites(workspaceSlug: string): Promise<any[]> {
        return this.get(`/project/${workspaceSlug}/user-favorite-projects/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async addProjectToFavorites(workspaceSlug: string, project: string): Promise<any> {
        return this.post(`/project/${workspaceSlug}/user-favorite-projects/`, { project })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async removeProjectFromFavorites(workspaceSlug: string, projectId: string): Promise<any> {
        return this.delete(`/project/${workspaceSlug}/user-favorite-projects/${projectId}/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async projectIssuesSearch(
        workspaceSlug: string,
        projectId: string,
        params: TProjectIssuesSearchParams
    ): Promise<ISearchIssueResponse[]> {
        return this.get(`/project/${workspaceSlug}/${projectId}/search-issues`, {
            params,
        })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }
}

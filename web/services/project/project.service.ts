import { APIService } from "@services/api.service"

import { API_BASE_URL } from "@helpers/common.helper"

import type { IProject, ISearchIssueResponse, TProjectIssuesSearchParams } from "@servcy/types"

export class ProjectService extends APIService {
    constructor() {
        super(API_BASE_URL)
    }

    async createProject(workspaceSlug: string, data: Partial<IProject>): Promise<IProject> {
        return this.post(`/project/workspace/${workspaceSlug}/projects/`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response
            })
    }

    async checkProjectIdentifierAvailability(workspaceSlug: string, data: string): Promise<any> {
        return this.get(`/project/workspace/${workspaceSlug}/project-identifiers`, {
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
        return this.get(`/project/workspace/${workspaceSlug}/projects/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getProject(workspaceSlug: string, projectId: string): Promise<IProject> {
        return this.get(`/project/workspace/${workspaceSlug}/projects/${projectId}/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async updateProject(workspaceSlug: string, projectId: string, data: Partial<IProject>): Promise<IProject> {
        return this.patch(`/project/workspace/${workspaceSlug}/projects/${projectId}/`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async deleteProject(workspaceSlug: string, projectId: string): Promise<any> {
        return this.delete(`/project/workspace/${workspaceSlug}/projects/${projectId}/`)
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
        await this.post(`/project/workspace/${workspaceSlug}/projects/${projectId}/project-views/`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getUserProjectFavorites(workspaceSlug: string): Promise<any[]> {
        return this.get(`/project/workspace/${workspaceSlug}/user-favorite-projects/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async addProjectToFavorites(workspaceSlug: string, project: string): Promise<any> {
        return this.post(`/project/workspace/${workspaceSlug}/user-favorite-projects/`, { project })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async removeProjectFromFavorites(workspaceSlug: string, projectId: string): Promise<any> {
        return this.delete(`/project/workspace/${workspaceSlug}/user-favorite-projects/${projectId}/`)
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
        return this.get(`/project/workspace/${workspaceSlug}/projects/${projectId}/search-issues/`, {
            params,
        })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }
}

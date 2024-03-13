import { APIService } from "@services/api.service"

import { API_BASE_URL } from "@helpers/common.helper"

import { IIssueLabel } from "@servcy/types"

export class IssueLabelService extends APIService {
    constructor() {
        super(API_BASE_URL)
    }

    async getWorkspaceIssueLabels(workspaceSlug: string): Promise<IIssueLabel[]> {
        return this.get(`/project/workspace/${workspaceSlug}/labels/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getProjectLabels(workspaceSlug: string, projectId: string): Promise<IIssueLabel[]> {
        return this.get(`/project/workspace/${workspaceSlug}/projects/${projectId}/issue-labels/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async createIssueLabel(workspaceSlug: string, projectId: string, data: any): Promise<IIssueLabel> {
        return this.post(`/project/workspace/${workspaceSlug}/projects/${projectId}/issue-labels/`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async patchIssueLabel(workspaceSlug: string, projectId: string, labelId: string, data: any): Promise<any> {
        return this.patch(`/project/workspace/${workspaceSlug}/projects/${projectId}/issue-labels/${labelId}/`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async deleteIssueLabel(workspaceSlug: string, projectId: string, labelId: string): Promise<any> {
        return this.delete(`/project/workspace/${workspaceSlug}/projects/${projectId}/issue-labels/${labelId}/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }
}

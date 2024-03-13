import { APIService } from "@services/api.service"

import { API_BASE_URL } from "@helpers/common.helper"

import { TIssue } from "@servcy/types"

export class IssueArchiveService extends APIService {
    constructor() {
        super(API_BASE_URL)
    }

    async getArchivedIssues(workspaceSlug: string, projectId: string, queries?: any): Promise<any> {
        return this.get(`/project/workspace/${workspaceSlug}/projects/${projectId}/archived-issues/`, {
            params: { ...queries },
        })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async archiveIssue(
        workspaceSlug: string,
        projectId: string,
        issueId: string
    ): Promise<{
        archived_at: string
    }> {
        return this.post(`/project/workspace/${workspaceSlug}/projects/${projectId}/issues/${issueId}/archive/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async restoreIssue(workspaceSlug: string, projectId: string, issueId: string): Promise<any> {
        return this.delete(`/project/workspace/${workspaceSlug}/projects/${projectId}/issues/${issueId}/archive/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async retrieveArchivedIssue(
        workspaceSlug: string,
        projectId: string,
        issueId: string,
        queries?: any
    ): Promise<TIssue> {
        return this.get(`/project/workspace/${workspaceSlug}/projects/${projectId}/issues/${issueId}/archive/`, {
            params: queries,
        })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }
}

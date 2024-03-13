// helper
import { APIService } from "@services/api.service"

import { API_BASE_URL } from "@helpers/common.helper"

// type
import type { TIssue, TIssueActivity, TIssueLink, TIssueSubIssues } from "@servcy/types"

export class IssueService extends APIService {
    constructor() {
        super(API_BASE_URL)
    }

    async createIssue(workspaceSlug: string, projectId: string, data: any): Promise<any> {
        return this.post(`/project/${workspaceSlug}/${projectId}/issues/`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getIssues(workspaceSlug: string, projectId: string, queries?: any): Promise<TIssue[]> {
        return this.get(`/project/${workspaceSlug}/${projectId}/issues/`, {
            params: queries,
        })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getIssuesWithParams(
        workspaceSlug: string,
        projectId: string,
        queries?: any
    ): Promise<TIssue[] | { [key: string]: TIssue[] }> {
        return this.get(`/project/${workspaceSlug}/${projectId}/issues/`, {
            params: queries,
        })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async retrieve(workspaceSlug: string, projectId: string, issueId: string, queries?: any): Promise<TIssue> {
        return this.get(`/project/${workspaceSlug}/${projectId}/issues/${issueId}/`, {
            params: queries,
        })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async retrieveIssues(workspaceSlug: string, projectId: string, issueIds: string[]): Promise<TIssue[]> {
        return this.get(`/project/${workspaceSlug}/${projectId}/issues/list/`, {
            params: { issues: issueIds.join(",") },
        })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getIssueActivities(workspaceSlug: string, projectId: string, issueId: string): Promise<TIssueActivity[]> {
        return this.get(`/project/${workspaceSlug}/${projectId}/issues/${issueId}/history/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async addIssueToCycle(
        workspaceSlug: string,
        projectId: string,
        cycleId: string,
        data: {
            issues: string[]
        }
    ) {
        return this.post(
            `/project/${workspaceSlug}/${projectId}/cycles/${cycleId}/cycle-issues/`,
            data
        )
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async removeIssueFromCycle(workspaceSlug: string, projectId: string, cycleId: string, bridgeId: string) {
        return this.delete(
            `/project/${workspaceSlug}/${projectId}/cycles/${cycleId}/cycle-issues/${bridgeId}/`
        )
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async createIssueRelation(
        workspaceSlug: string,
        projectId: string,
        issueId: string,
        data: {
            related_list: Array<{
                relation_type: "duplicate" | "relates_to" | "blocked_by"
                related_issue: string
            }>
            relation?: "blocking" | null
        }
    ) {
        return this.post(
            `/project/${workspaceSlug}/${projectId}/issues/${issueId}/relation/`,
            data
        )
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response
            })
    }

    async deleteIssueRelation(workspaceSlug: string, projectId: string, issueId: string, relationId: string) {
        return this.delete(
            `/project/${workspaceSlug}/${projectId}/issues/${issueId}/relation/${relationId}/`
        )
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response
            })
    }

    async patchIssue(workspaceSlug: string, projectId: string, issueId: string, data: Partial<TIssue>): Promise<any> {
        return this.patch(`/project/${workspaceSlug}/${projectId}/issues/${issueId}/`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async deleteIssue(workspaceSlug: string, projectId: string, issuesId: string): Promise<any> {
        return this.delete(`/project/${workspaceSlug}/${projectId}/issues/${issuesId}/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async bulkDeleteIssues(workspaceSlug: string, projectId: string, data: any): Promise<any> {
        return this.delete(`/project/${workspaceSlug}/${projectId}/issues/delete/`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async subIssues(workspaceSlug: string, projectId: string, issueId: string): Promise<TIssueSubIssues> {
        return this.get(`/project/${workspaceSlug}/${projectId}/issues/${issueId}/sub/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async addSubIssues(
        workspaceSlug: string,
        projectId: string,
        issueId: string,
        data: { sub_issue_ids: string[] }
    ): Promise<TIssueSubIssues> {
        return this.post(
            `/project/${workspaceSlug}/${projectId}/issues/${issueId}/sub/`,
            data
        )
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async fetchIssueLinks(workspaceSlug: string, projectId: string, issueId: string): Promise<TIssueLink[]> {
        return this.get(`/project/${workspaceSlug}/${projectId}/issues/${issueId}/links/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response
            })
    }

    async createIssueLink(
        workspaceSlug: string,
        projectId: string,
        issueId: string,
        data: Partial<TIssueLink>
    ): Promise<TIssueLink> {
        return this.post(
            `/project/${workspaceSlug}/${projectId}/issues/${issueId}/links/`,
            data
        )
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response
            })
    }

    async updateIssueLink(
        workspaceSlug: string,
        projectId: string,
        issueId: string,
        linkId: string,
        data: Partial<TIssueLink>
    ): Promise<TIssueLink> {
        return this.patch(
            `/project/${workspaceSlug}/${projectId}/issues/${issueId}/links/${linkId}/`,
            data
        )
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response
            })
    }

    async deleteIssueLink(workspaceSlug: string, projectId: string, issueId: string, linkId: string): Promise<any> {
        return this.delete(
            `/project/${workspaceSlug}/${projectId}/issues/${issueId}/links/${linkId}/`
        )
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }
}

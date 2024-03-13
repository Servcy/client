import { APIService } from "@services/api.service"

import { API_BASE_URL } from "@helpers/common.helper"

import type { TIssue, TIssueRelation, TIssueRelationTypes } from "@servcy/types"

export class IssueRelationService extends APIService {
    constructor() {
        super(API_BASE_URL)
    }

    async listIssueRelations(workspaceSlug: string, projectId: string, issueId: string): Promise<TIssueRelation> {
        return this.get(`/project/${workspaceSlug}/${projectId}/issues/${issueId}/relation/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async createIssueRelations(
        workspaceSlug: string,
        projectId: string,
        issueId: string,
        data: { relation_type: TIssueRelationTypes; issues: string[] }
    ): Promise<TIssue[]> {
        return this.post(
            `/project/${workspaceSlug}/${projectId}/issues/${issueId}/relation/`,
            data
        )
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async deleteIssueRelation(
        workspaceSlug: string,
        projectId: string,
        issueId: string,
        data: { relation_type: TIssueRelationTypes; related_issue: string }
    ): Promise<any> {
        return this.post(
            `/project/${workspaceSlug}/${projectId}/issues/${issueId}/relation/remove/`,
            data
        )
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }
}

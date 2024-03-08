// helper
import { APIService } from "@services/api.service"

import { API_BASE_URL } from "@helpers/common.helper"

import { TIssueComment } from "@servcy/types"

export class IssueCommentService extends APIService {
    constructor() {
        super(API_BASE_URL)
    }

    async getIssueComments(
        workspaceSlug: string,
        projectId: string,
        issueId: string,
        params:
            | {
                  created_at__gt: string
              }
            | {} = {}
    ): Promise<TIssueComment[]> {
        return this.get(`/project/workspaces/${workspaceSlug}/projects/${projectId}/issues/${issueId}/history/`, {
            params: {
                activity_type: "issue-comment",
                ...params,
            },
        })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async createIssueComment(
        workspaceSlug: string,
        projectId: string,
        issueId: string,
        data: Partial<TIssueComment>
    ): Promise<any> {
        return this.post(`/project/workspaces/${workspaceSlug}/projects/${projectId}/issues/${issueId}/comments/`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async patchIssueComment(
        workspaceSlug: string,
        projectId: string,
        issueId: string,
        commentId: string,
        data: Partial<TIssueComment>
    ): Promise<any> {
        return this.patch(
            `/project/workspaces/${workspaceSlug}/projects/${projectId}/issues/${issueId}/comments/${commentId}/`,
            data
        )
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async deleteIssueComment(
        workspaceSlug: string,
        projectId: string,
        issueId: string,
        commentId: string
    ): Promise<any> {
        return this.delete(
            `/project/workspaces/${workspaceSlug}/projects/${projectId}/issues/${issueId}/comments/${commentId}/`
        )
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }
}

// helper
import { APIService } from "@services/api.service"

import { API_BASE_URL } from "@helpers/common.helper"

import { TIssueAttachment } from "@servcy/types"

export class IssueAttachmentService extends APIService {
    constructor() {
        super(API_BASE_URL)
    }

    async uploadIssueAttachment(
        workspaceSlug: string,
        projectId: string,
        issueId: string,
        file: FormData
    ): Promise<TIssueAttachment> {
        return this.post(`/project/${workspaceSlug}/${projectId}/issues/${issueId}/attachments/`, file, {
            headers: {
                ...this.getHeaders(),
                "Content-Type": "multipart/form-data",
            },
        })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getIssueAttachment(workspaceSlug: string, projectId: string, issueId: string): Promise<TIssueAttachment[]> {
        return this.get(`/project/${workspaceSlug}/${projectId}/issues/${issueId}/attachments/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async deleteIssueAttachment(
        workspaceSlug: string,
        projectId: string,
        issueId: string,
        assetId: string
    ): Promise<TIssueAttachment> {
        return this.delete(`/project/${workspaceSlug}/${projectId}/issues/${issueId}/attachments/${assetId}/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }
}

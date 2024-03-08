// helper
import { APIService } from "@services/api.service"

import { API_BASE_URL } from "@helpers/common.helper"

import { TIssueActivity } from "@servcy/types"

export class IssueActivityService extends APIService {
    constructor() {
        super(API_BASE_URL)
    }

    async getIssueActivities(
        workspaceSlug: string,
        projectId: string,
        issueId: string,
        params:
            | {
                  created_at__gt: string
              }
            | {} = {}
    ): Promise<TIssueActivity[]> {
        return this.get(`/project/workspaces/${workspaceSlug}/projects/${projectId}/issues/${issueId}/history/`, {
            params: {
                activity_type: "issue-property",
                ...params,
            },
        })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }
}

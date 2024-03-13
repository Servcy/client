import { APIService } from "@services/api.service"

import { API_BASE_URL } from "@helpers/common.helper"

import {
    ILastActiveWorkspaceDetails,
    IUserProjectsRole,
    IWorkspace,
    IWorkspaceBulkInviteFormData,
    IWorkspaceMember,
    IWorkspaceMemberInvitation,
    IWorkspaceMemberMe,
    IWorkspaceSearchResults,
    IWorkspaceView,
    IWorkspaceViewProps,
    TIssue,
} from "@servcy/types"

export class WorkspaceService extends APIService {
    constructor() {
        super(API_BASE_URL)
    }

    // iam routes

    async createWorkspace(data: Partial<IWorkspace>): Promise<IWorkspace> {
        return this.post("/iam/workspaces", data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async updateWorkspace(workspaceSlug: string, data: Partial<IWorkspace>): Promise<IWorkspace> {
        return this.patch(`/iam/workspace/${workspaceSlug}`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async deleteWorkspace(workspaceSlug: string): Promise<any> {
        return this.delete(`/iam/workspace/${workspaceSlug}`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async inviteWorkspace(workspaceSlug: string, data: IWorkspaceBulkInviteFormData): Promise<any> {
        return this.post(`/iam/workspace/${workspaceSlug}/invitations`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async joinWorkspace(workspaceSlug: string, invitationId: string, data: any): Promise<any> {
        return this.post(`/iam/workspace/${workspaceSlug}/invitations/${invitationId}/join`, data, {
            headers: {},
        })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async joinWorkspaces(data: any): Promise<any> {
        return this.post("/iam/me/workspace/invitations", data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getLastActiveWorkspaceAndProjects(): Promise<ILastActiveWorkspaceDetails> {
        return this.get("/iam/me/last/visited/workspace/project")
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async userWorkspaceInvitations(): Promise<{
        count: number
        next: string
        previous: string
        results: IWorkspaceMemberInvitation[]
    }> {
        return this.get("/iam/me/workspace/invitations")
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async workspaceMemberMe(workspaceSlug: string): Promise<IWorkspaceMemberMe> {
        return this.get(`/iam/workspace/${workspaceSlug}/members/me`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response
            })
    }

    async updateWorkspaceView(workspaceSlug: string, data: { view_props: IWorkspaceViewProps }): Promise<any> {
        return this.post(`/iam/workspace/${workspaceSlug}/views`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async fetchWorkspaceMembers(workspaceSlug: string): Promise<IWorkspaceMember[]> {
        return this.get(`/iam/workspace/${workspaceSlug}/members`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async updateWorkspaceMember(
        workspaceSlug: string,
        memberId: string,
        data: Partial<IWorkspaceMember>
    ): Promise<IWorkspaceMember> {
        return this.patch(`/iam/workspace/${workspaceSlug}/members/${memberId}`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async deleteWorkspaceMember(workspaceSlug: string, memberId: string): Promise<any> {
        return this.delete(`/iam/workspace/${workspaceSlug}/members/${memberId}`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async workspaceInvitations(workspaceSlug: string): Promise<IWorkspaceMemberInvitation[]> {
        return this.get(`/iam/workspace/${workspaceSlug}/invitations`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getWorkspaceInvitation(workspaceSlug: string, invitationId: string): Promise<IWorkspaceMemberInvitation> {
        return this.get(`/iam/workspace/${workspaceSlug}/invitations/${invitationId}/join`, { headers: {} })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async updateWorkspaceInvitation(
        workspaceSlug: string,
        invitationId: string,
        data: Partial<IWorkspaceMember>
    ): Promise<any> {
        return this.patch(`/iam/workspace/${workspaceSlug}/invitations/${invitationId}`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async deleteWorkspaceInvitations(workspaceSlug: string, invitationId: string): Promise<any> {
        return this.delete(`/iam/workspace/${workspaceSlug}/invitations/${invitationId}`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async workspaceSlugCheck(slug: string): Promise<any> {
        return this.get(`/iam/workspace/slug/check?slug=${slug}`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    // project routes

    async userWorkspaces(): Promise<IWorkspace[]> {
        return this.get("/project/me/workspaces")
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async searchWorkspace(
        workspaceSlug: string,
        params: {
            project_id?: string
            search: string
            workspace_search: boolean
        }
    ): Promise<IWorkspaceSearchResults> {
        return this.get(`/project/workspace/${workspaceSlug}/search/`, {
            params,
        })
            .then((res) => res?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async createView(workspaceSlug: string, data: Partial<IWorkspaceView>): Promise<IWorkspaceView> {
        return this.post(`/project/workspace/${workspaceSlug}/views/`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async updateView(workspaceSlug: string, viewId: string, data: Partial<IWorkspaceView>): Promise<IWorkspaceView> {
        return this.patch(`/project/workspace/${workspaceSlug}/views/${viewId}/`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async deleteView(workspaceSlug: string, viewId: string): Promise<any> {
        return this.delete(`/project/workspace/${workspaceSlug}/views/${viewId}/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getAllViews(workspaceSlug: string): Promise<IWorkspaceView[]> {
        return this.get(`/project/workspace/${workspaceSlug}/views/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getViewDetails(workspaceSlug: string, viewId: string): Promise<IWorkspaceView> {
        return this.get(`/project/workspace/${workspaceSlug}/views/${viewId}/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getViewIssues(workspaceSlug: string, params: any): Promise<TIssue[]> {
        return this.get(`/project/workspace/${workspaceSlug}/issues/`, {
            params,
        })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getWorkspaceUserProjectsRole(workspaceSlug: string): Promise<IUserProjectsRole> {
        return this.get(`/project/users/me/workspace/${workspaceSlug}/project-roles/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }
}

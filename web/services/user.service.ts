import { APIService } from "@services/api.service"

import { API_BASE_URL } from "@helpers/common.helper"

import type {
    IUser,
    IUserActivityResponse,
    IUserEmailNotificationSettings,
    IUserProfileData,
    IUserProfileProjectSegregation,
    IUserSettings,
    IUserWorkspaceDashboard,
    TIssue,
} from "@servcy/types"

export class UserService extends APIService {
    constructor() {
        super(API_BASE_URL)
    }

    // iam routes

    async currentUser(): Promise<IUser> {
        const accessToken = this.getAccessToken()
        if (!accessToken) throw new Error("Access token not found")
        return this.get("/iam/me")
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response
            })
    }

    async currentUserSettings(): Promise<IUserSettings> {
        return this.get("/iam/me/settings")
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response
            })
    }

    async currentUserEmailNotificationSettings(): Promise<IUserEmailNotificationSettings> {
        return this.get("/notification/preferences")
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response
            })
    }

    async updateUser(data: Partial<IUser>): Promise<any> {
        return this.patch("/iam/me", data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async updateUserOnBoard(): Promise<any> {
        return this.patch("/iam/me/onboard", {
            is_onboarded: true,
        })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async updateUserTourCompleted(): Promise<any> {
        return this.patch("/iam/me/tour-completed", {
            is_tour_completed: true,
        })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async userIssues(
        workspaceSlug: string,
        params: any
    ): Promise<
        | {
              [key: string]: TIssue[]
          }
        | TIssue[]
    > {
        return this.get(`/project/${workspaceSlug}/my-issues/`, {
            params,
        })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async updateCurrentUserEmailNotificationSettings(data: Partial<IUserEmailNotificationSettings>): Promise<any> {
        return this.patch("/notification/preferences", data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getUserActivity(): Promise<IUserActivityResponse> {
        return this.get(`/project/me/activities/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async userWorkspaceDashboard(workspaceSlug: string, month: number): Promise<IUserWorkspaceDashboard> {
        return this.get(`/project/me/${workspaceSlug}/dashboard/`, {
            params: {
                month: month,
            },
        })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getUserProfileData(workspaceSlug: string, userId: string): Promise<IUserProfileData> {
        return this.get(`/project/${workspaceSlug}/user-stats/${userId}/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getUserProfileProjectsStats(workspaceSlug: string, userId: string): Promise<IUserProfileProjectSegregation> {
        return this.get(`/project/${workspaceSlug}/user-project-stats/${userId}/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getUserProfileActivity(workspaceSlug: string, userId: string): Promise<IUserActivityResponse> {
        return this.get(`/project/${workspaceSlug}/user-activity/${userId}/?per_page=15`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getUserProfileIssues(workspaceSlug: string, userId: string, params: any): Promise<TIssue[]> {
        return this.get(`/project/${workspaceSlug}/user-issues/${userId}/`, {
            params,
        })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async deactivateAccount() {
        return this.delete(`/iam/me`)
            .then((response) => {
                this.purgeAccessToken()
                this.purgeRefreshToken()
                return response?.data
            })
            .catch((error) => {
                this.purgeAccessToken()
                this.purgeRefreshToken()
                throw error?.response?.data
            })
    }

    async leaveWorkspace(workspaceSlug: string) {
        return this.post(`/iam/${workspaceSlug}/members/leave`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async joinProject(workspaceSlug: string, project_ids: string[]): Promise<any> {
        return this.post(`/project/me/${workspaceSlug}/invitations/`, { project_ids })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async leaveProject(workspaceSlug: string, projectId: string) {
        return this.post(`/project/${workspaceSlug}/${projectId}/members/leave/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }
}

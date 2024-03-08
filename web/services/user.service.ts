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

    async userIssues(
        workspaceSlug: string,
        params: any
    ): Promise<
        | {
              [key: string]: TIssue[]
          }
        | TIssue[]
    > {
        return this.get(`/api/workspaces/${workspaceSlug}/my-issues/`, {
            params,
        })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async currentUser(): Promise<IUser> {
        return this.get("/iam/users/me/")
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response
            })
    }

    async currentUserSettings(): Promise<IUserSettings> {
        return this.get("/iam/users/me/settings/")
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response
            })
    }

    async currentUserEmailNotificationSettings(): Promise<IUserEmailNotificationSettings> {
        return this.get("/notification/users/me/notification-preferences")
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response
            })
    }

    async updateUser(data: Partial<IUser>): Promise<any> {
        return this.patch("/iam/users/me/", data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async updateUserOnBoard(): Promise<any> {
        return this.patch("/iam/users/me/onboard", {
            is_onboarded: true,
        })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async updateUserTourCompleted(): Promise<any> {
        return this.patch("/iam/users/me/tour-completed", {
            is_tour_completed: true,
        })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async updateCurrentUserEmailNotificationSettings(data: Partial<IUserEmailNotificationSettings>): Promise<any> {
        return this.patch("/notification/users/me/notification-preferences", data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getUserActivity(): Promise<IUserActivityResponse> {
        return this.get(`/iam/users/me/activities/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async userWorkspaceDashboard(workspaceSlug: string, month: number): Promise<IUserWorkspaceDashboard> {
        return this.get(`/iam/users/me/workspaces/${workspaceSlug}/dashboard/`, {
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
        return this.get(`/api/workspaces/${workspaceSlug}/user-stats/${userId}/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getUserProfileProjectsSegregation(
        workspaceSlug: string,
        userId: string
    ): Promise<IUserProfileProjectSegregation> {
        return this.get(`/api/workspaces/${workspaceSlug}/user-profile/${userId}/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getUserProfileActivity(workspaceSlug: string, userId: string): Promise<IUserActivityResponse> {
        return this.get(`/api/workspaces/${workspaceSlug}/user-activity/${userId}/?per_page=15`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getUserProfileIssues(workspaceSlug: string, userId: string, params: any): Promise<TIssue[]> {
        return this.get(`/api/workspaces/${workspaceSlug}/user-issues/${userId}/`, {
            params,
        })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async deactivateAccount() {
        return this.delete(`/iam/users/me/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async leaveWorkspace(workspaceSlug: string) {
        return this.post(`/api/workspaces/${workspaceSlug}/members/leave/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async joinProject(workspaceSlug: string, project_ids: string[]): Promise<any> {
        return this.post(`/project/users/me/workspaces/${workspaceSlug}/projects/invitations/`, { project_ids })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async leaveProject(workspaceSlug: string, projectId: string) {
        return this.post(`/api/workspaces/${workspaceSlug}/projects/${projectId}/members/leave/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }
}

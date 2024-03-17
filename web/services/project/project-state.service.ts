import { APIService } from "@services/api.service"

import { API_BASE_URL } from "@helpers/common.helper"

import type { IState } from "@servcy/types"

export class ProjectStateService extends APIService {
    constructor() {
        super(API_BASE_URL)
    }

    async createState(workspaceSlug: string, projectId: string, data: any): Promise<IState> {
        return this.post(`/project/${workspaceSlug}/${projectId}/states`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response
            })
    }

    async markDefault(workspaceSlug: string, projectId: string, stateId: string): Promise<void> {
        return this.post(`/project/${workspaceSlug}/${projectId}/states/${stateId}/mark-default`, {})
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response
            })
    }

    async getStates(workspaceSlug: string, projectId: string): Promise<IState[]> {
        return this.get(`/project/${workspaceSlug}/${projectId}/states`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getState(workspaceSlug: string, projectId: string, stateId: string): Promise<any> {
        return this.get(`/project/${workspaceSlug}/${projectId}/states/${stateId}`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async updateState(workspaceSlug: string, projectId: string, stateId: string, data: IState): Promise<any> {
        return this.put(`/project/${workspaceSlug}/${projectId}/states/${stateId}`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response
            })
    }

    async patchState(workspaceSlug: string, projectId: string, stateId: string, data: Partial<IState>): Promise<any> {
        return this.patch(`/project/${workspaceSlug}/${projectId}/states/${stateId}`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async deleteState(workspaceSlug: string, projectId: string, stateId: string): Promise<any> {
        return this.delete(`/project/${workspaceSlug}/${projectId}/states/${stateId}`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response
            })
    }

    async getWorkspaceStates(workspaceSlug: string): Promise<IState[]> {
        return this.get(`/project/${workspaceSlug}/states`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }
}

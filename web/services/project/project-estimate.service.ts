import { APIService } from "@services/api.service"

import { API_BASE_URL } from "@helpers/common.helper"

import type { IEstimate, IEstimateFormData, IEstimatePoint } from "@servcy/types"

export class ProjectEstimateService extends APIService {
    constructor() {
        super(API_BASE_URL)
    }

    async createEstimate(
        workspaceSlug: string,
        projectId: string,
        data: IEstimateFormData
    ): Promise<{
        estimate: IEstimate
        estimate_points: IEstimatePoint[]
    }> {
        return this.post(`/project/workspace/${workspaceSlug}/projects/${projectId}/estimates/`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response
            })
    }

    async patchEstimate(
        workspaceSlug: string,
        projectId: string,
        estimateId: string,
        data: IEstimateFormData
    ): Promise<any> {
        return this.patch(`/project/workspace/${workspaceSlug}/projects/${projectId}/estimates/${estimateId}/`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getEstimateDetails(workspaceSlug: string, projectId: string, estimateId: string): Promise<IEstimate> {
        return this.get(`/project/workspace/${workspaceSlug}/projects/${projectId}/estimates/${estimateId}/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getEstimatesList(workspaceSlug: string, projectId: string): Promise<IEstimate[]> {
        return this.get(`/project/workspace/${workspaceSlug}/projects/${projectId}/estimates/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async deleteEstimate(workspaceSlug: string, projectId: string, estimateId: string): Promise<any> {
        return this.delete(`/project/workspace/${workspaceSlug}/projects/${projectId}/estimates/${estimateId}/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getWorkspaceEstimatesList(workspaceSlug: string): Promise<IEstimate[]> {
        return this.get(`/project/workspace/${workspaceSlug}/estimates/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }
}

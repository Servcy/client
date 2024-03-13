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
        return this.post(`/project/${workspaceSlug}/${projectId}/estimates/`, data)
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
        return this.patch(`/project/${workspaceSlug}/${projectId}/estimates/${estimateId}/`, data)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getEstimateDetails(workspaceSlug: string, projectId: string, estimateId: string): Promise<IEstimate> {
        return this.get(`/project/${workspaceSlug}/${projectId}/estimates/${estimateId}/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getEstimatesList(workspaceSlug: string, projectId: string): Promise<IEstimate[]> {
        return this.get(`/project/${workspaceSlug}/${projectId}/estimates/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async deleteEstimate(workspaceSlug: string, projectId: string, estimateId: string): Promise<any> {
        return this.delete(`/project/${workspaceSlug}/${projectId}/estimates/${estimateId}/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async getWorkspaceEstimatesList(workspaceSlug: string): Promise<IEstimate[]> {
        return this.get(`/project/${workspaceSlug}/estimates/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }
}

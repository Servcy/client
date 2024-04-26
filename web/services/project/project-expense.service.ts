import { APIService } from "@services/api.service"

import { API_BASE_URL } from "@helpers/common.helper"

import { IProjectExpense } from "@servcy/types"

export class ProjectExpenseService extends APIService {
    constructor() {
        super(API_BASE_URL)
    }

    async getProjectExpenses(workspaceSlug: string, projectId: string): Promise<IProjectExpense[]> {
        return this.get(`/project/${workspaceSlug}/${projectId}/expense`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async createProjectExpenses(
        workspaceSlug: string,
        projectId: string,
        expense: Partial<IProjectExpense>
    ): Promise<IProjectExpense> {
        return this.post(`/project/${workspaceSlug}/${projectId}/expense`, expense)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async updateProjectExpenses(
        workspaceSlug: string,
        projectId: string,
        expense: Partial<IProjectExpense>
    ): Promise<IProjectExpense> {
        return this.patch(`/project/${workspaceSlug}/${projectId}/expense`, expense)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }

    async deleteProjectExpenses(workspaceSlug: string, projectId: string, expenseId: string): Promise<void> {
        return this.delete(`/project/${workspaceSlug}/${projectId}/expense`, {
            expense_id: expenseId,
        })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data
            })
    }
}

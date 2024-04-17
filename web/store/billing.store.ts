import set from "lodash/set"
import { action, computed, makeObservable, observable, runInAction } from "mobx"

import { WorkspaceService } from "@services/workspace.service"

import { IWorkspaceSubscription } from "@servcy/types"

import { RootStore } from "./root.store"

export interface StoreIBillingStore {
    // observables
    workspaceSubscriptionMap: {
        [workspaceSlug: string]: IWorkspaceSubscription
    }
    // computed
    workspaceInvitationLimit: number
    currentWorkspaceSubscription: IWorkspaceSubscription | null
    // fetch actions
    fetchWorkspaceSubscriptionInfo: (workspaceSlug: string) => Promise<IWorkspaceSubscription>
}

export class BillingStore implements StoreIBillingStore {
    // observables
    workspaceSubscriptionMap: {
        [workspaceSlug: string]: IWorkspaceSubscription
    } = {}
    // services
    workspaceService
    // root store
    router
    user

    constructor(_rootStore: RootStore) {
        makeObservable(this, {
            // observables
            workspaceSubscriptionMap: observable,
            // computed
            currentWorkspaceSubscription: computed,
            workspaceInvitationLimit: computed,
            // actions
            fetchWorkspaceSubscriptionInfo: action,
        })
        this.workspaceService = new WorkspaceService()
        this.router = _rootStore.app.router
        this.user = _rootStore.user
    }

    /**
     * computed value of the workspace seats limit
     */
    get workspaceInvitationLimit() {
        const workspaceSlug = this.router.workspaceSlug
        if (!workspaceSlug) return 5
        return this.workspaceSubscriptionMap[workspaceSlug]?.limits.invitations || 5
    }

    /**
     * computed value of the current workspace subscription
     */
    get currentWorkspaceSubscription() {
        const workspaceSlug = this.router.workspaceSlug
        if (!workspaceSlug) return null
        return this.workspaceSubscriptionMap[workspaceSlug] || null
    }

    /**
     * Fetches the current user workspace info
     * @param workspaceSlug
     * @returns Promise<IWorkspaceMemberMe>
     */
    fetchWorkspaceSubscriptionInfo = async (workspaceSlug: string) =>
        await this.workspaceService.workspaceSubscription(workspaceSlug).then((response) => {
            runInAction(() => {
                set(this.workspaceSubscriptionMap, [workspaceSlug], response)
            })
            return response
        })
}

import set from "lodash/set"
import { action, computed, makeObservable, observable, runInAction } from "mobx"

import { PLAN_LIMITS } from "@constants/billing"

import { BillingService } from "@services/billing.service"

import { IWorkspaceSubscription } from "@servcy/types"

import { RootStore } from "./root.store"

export interface StoreIBillingStore {
    // observables
    workspaceSubscriptionMap: {
        [workspaceSlug: string]: IWorkspaceSubscription
    }
    // computed
    workspaceInvitationLimit: number
    isCurrentWorkspaceSubscribed: boolean
    currentWorkspaceSubscription: IWorkspaceSubscription | null
    // computed actions
    getSubscriptionByWorkspaceSlug: (workspaceSlug: string) => IWorkspaceSubscription | undefined
    // fetch actions
    fetchWorkspaceSubscription: (workspaceSlug: string) => Promise<IWorkspaceSubscription>
    cancelSubscription: (workspaceSlug: string) => Promise<void>
}

export class BillingStore implements StoreIBillingStore {
    // observables
    workspaceSubscriptionMap: {
        [workspaceSlug: string]: IWorkspaceSubscription
    } = {}
    // services
    billingService
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
            isCurrentWorkspaceSubscribed: computed,
            // actions
            fetchWorkspaceSubscription: action,
            cancelSubscription: action,
        })
        this.billingService = new BillingService()
        this.router = _rootStore.app.router
        this.user = _rootStore.user
    }

    /**
     * computed value of the workspace seats limit
     */
    get workspaceInvitationLimit() {
        const workspaceSlug = this.router.workspaceSlug
        if (!workspaceSlug) return PLAN_LIMITS.starter.invitations
        return this.workspaceSubscriptionMap[workspaceSlug]?.limits.invitations || PLAN_LIMITS.starter.invitations
    }

    get isCurrentWorkspaceSubscribed() {
        const workspaceSlug = this.router.workspaceSlug
        if (!workspaceSlug) return false
        return this.workspaceSubscriptionMap?.[workspaceSlug]?.plan_details?.name !== "Starter"
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
     * Returns subscription by workspace slug
     * @param workspaceSlug
     * @returns IWorkspaceSubscription | undefined
     */
    getSubscriptionByWorkspaceSlug = (workspaceSlug: string) => this.workspaceSubscriptionMap?.[workspaceSlug]

    /**
     * Fetches the current user workspace info
     * @param workspaceSlug
     * @returns Promise<IWorkspaceSubscription>
     */
    fetchWorkspaceSubscription = async (workspaceSlug: string) =>
        await this.billingService.fetchWorkspaceSubscription(workspaceSlug).then((response) => {
            runInAction(() => {
                set(this.workspaceSubscriptionMap, [workspaceSlug], response)
            })
            return response
        })

    /**
     * Cancel the current subscription
     * @param workspaceSlug
     * @returns Promise<void>
     */
    cancelSubscription = async (workspaceSlug: string) => await this.billingService.cancelSubscription(workspaceSlug)
}

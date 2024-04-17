import set from "lodash/set"
import { action, computed, makeObservable, observable, runInAction } from "mobx"

import { BillingService } from "@services/billing.service"

import { IWorkspaceSubscription, RazorpayPlans } from "@servcy/types"

import { RootStore } from "./root.store"

export interface StoreIBillingStore {
    // observables
    workspaceSubscriptionMap: {
        [workspaceSlug: string]: IWorkspaceSubscription
    }
    razorpayPlans: RazorpayPlans
    // computed
    workspaceInvitationLimit: number
    currentWorkspaceSubscription: IWorkspaceSubscription | null
    // fetch actions
    fetchWorkspaceSubscription: (workspaceSlug: string) => Promise<IWorkspaceSubscription>
    fetchRazorpayPlans: (workspaceSlug: string) => Promise<RazorpayPlans>
}

export class BillingStore implements StoreIBillingStore {
    // observables
    workspaceSubscriptionMap: {
        [workspaceSlug: string]: IWorkspaceSubscription
    } = {}
    razorpayPlans = {} as RazorpayPlans
    // services
    billingService
    // root store
    router
    user

    constructor(_rootStore: RootStore) {
        makeObservable(this, {
            // observables
            workspaceSubscriptionMap: observable,
            razorpayPlans: observable,
            // computed
            currentWorkspaceSubscription: computed,
            workspaceInvitationLimit: computed,
            // actions
            fetchWorkspaceSubscription: action,
            fetchRazorpayPlans: action,
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
     * Fetches the current user workspace info
     * @returns Promise<RazorpayPlans>
     */
    fetchRazorpayPlans = async (workspaceSlug: string) =>
        await this.billingService.fetchRazorpayPlans(workspaceSlug).then((response) => {
            runInAction(() => {
                this.razorpayPlans = response
            })
            return response
        })
}

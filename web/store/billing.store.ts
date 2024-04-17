import set from "lodash/set"
import { action, computed, makeObservable, observable, runInAction } from "mobx"
import { computedFn } from "mobx-utils"

import { BillingService } from "@services/billing.service"

import { IRazorpayPlan, IRazorpayPlans, IWorkspaceSubscription } from "@servcy/types"

import { RootStore } from "./root.store"

export interface StoreIBillingStore {
    // observables
    workspaceSubscriptionMap: {
        [workspaceSlug: string]: IWorkspaceSubscription
    }
    razorpayPlans: IRazorpayPlans
    // computed
    workspaceInvitationLimit: number
    currentWorkspaceSubscription: IWorkspaceSubscription | null
    // computed actions
    getPlanByName: (name: string) => IRazorpayPlan | undefined
    // fetch actions
    fetchWorkspaceSubscription: (workspaceSlug: string) => Promise<IWorkspaceSubscription>
    fetchRazorpayPlans: (workspaceSlug: string) => Promise<IRazorpayPlans>
}

export class BillingStore implements StoreIBillingStore {
    // observables
    workspaceSubscriptionMap: {
        [workspaceSlug: string]: IWorkspaceSubscription
    } = {}
    razorpayPlans = {} as IRazorpayPlans
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
     * Returns plan by name
     * @param name
     * @returns IRazorpayPlan | undefined
     */
    getPlanByName = computedFn((name: string) => this.razorpayPlans.items.find((plan) => plan.item.name === name))

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
     * @returns Promise<IRazorpayPlans>
     */
    fetchRazorpayPlans = async (workspaceSlug: string) =>
        await this.billingService.fetchRazorpayPlans(workspaceSlug).then((response) => {
            runInAction(() => {
                this.razorpayPlans = response
            })
            return response
        })
}

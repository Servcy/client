import set from "lodash/set"
import { makeObservable, observable, runInAction } from "mobx"

import { TimeTrackerService } from "@services/timer.service"

import { ITrackedTime } from "@servcy/types"

import { RootStore } from "./root.store"

export interface ITimerStore {
    timerMap: Record<string, ITrackedTime[]>
    timerRunning: ITrackedTime | null
    startTimer: (
        workspaceSlug: string,
        projectId: string,
        issueId: string,
        data: Partial<ITrackedTime>
    ) => Promise<void>
    checkIsTimerRunning: (workspaceSlug: string) => Promise<void>
    stopIssueTimer: (workspaceSlug: string) => Promise<void>
    fetchTimeSheet: (workspaceSlug: string, queries?: any) => Promise<void>
}

export class TimerStore implements ITimerStore {
    timerMap: Record<string, ITrackedTime[]> = {}
    timerRunning = null
    router
    timerService

    constructor(_rootStore: RootStore) {
        makeObservable(this, {
            timerMap: observable,
            timerRunning: observable,
        })
        this.timerService = new TimeTrackerService()
        this.router = _rootStore.app.router
    }

    /**
     * Start timer for an issue
     * @param workspaceSlug
     * @param projectId
     * @param issueId
     * @param data
     * @returns
     */
    startTimer = async (workspaceSlug: string, projectId: string, issueId: string, data: Partial<ITrackedTime>) => {
        try {
            const trackedTime = await this.timerService.startIssueTimer(workspaceSlug, projectId, issueId, data)
            runInAction(() => {
                this.timerRunning = trackedTime
            })
        } catch (error) {
            throw error
        }
    }

    /**
     * Check if timer is running
     * @param workspaceSlug
     * @returns
     */
    checkIsTimerRunning = async (workspaceSlug: string) => {
        try {
            const response = await this.timerService.isTimerRunning(workspaceSlug)
            runInAction(() => {
                this.timerRunning = response
            })
        } catch (error) {
            throw error
        }
    }

    /**
     * Stop timer for an issue
     * @param workspaceSlug
     * @returns
     */
    stopIssueTimer = async (workspaceSlug: string) => {
        try {
            if (!this.timerRunning) return
            const issueId = this.timerRunning["issue"]
            const projectId = this.timerRunning["project"]
            await this.timerService.stopIssueTimer(workspaceSlug, projectId, this.timerRunning["id"])
            runInAction(() => {
                set(this.timerMap, issueId, [...(this.timerMap[issueId] || []), this.timerRunning])
                this.timerRunning = null
            })
        } catch (error) {
            throw error
        }
    }

    /**
     * Fetch timesheet for a workspace
     * @param workspaceSlug
     * @param queries
     * @returns
     */
    fetchTimeSheet = async (workspaceSlug: string, queries?: any) => {
        try {
            const timeSheet = await this.timerService.fetchTimeSheet(workspaceSlug, queries)
            runInAction(() => {
                timeSheet.forEach((time: ITrackedTime) => {
                    set(this.timerMap, time.issue, [...(this.timerMap[time.issue] || []), time])
                })
            })
        } catch (error) {
            throw error
        }
    }
}

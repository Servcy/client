import set from "lodash/set"
import { makeObservable, observable, runInAction } from "mobx"

import { TimeTrackerService } from "@services/timer.service"

import { ITrackedTime } from "@servcy/types"

import { RootStore } from "./root.store"

export interface ITimerStore {
    timerMap: Record<string, ITrackedTime[]>
    isTimerRunning: ITrackedTime | null
    startTimer: (
        workspaceSlug: string,
        projectId: string,
        issueId: string,
        data: Partial<ITrackedTime>
    ) => Promise<void>
    checkIsTimerRunning: (workspaceSlug: string) => Promise<void>
    stopIssueTimer: (workspaceSlug: string, projectId: string, issueId: string, timerId: string) => Promise<void>
    fetchTimeSheet: (workspaceSlug: string, queries?: any) => Promise<void>
}

export class TimerStore implements ITimerStore {
    timerMap: Record<string, ITrackedTime[]> = {}
    isTimerRunning = null
    router
    timerService

    constructor(_rootStore: RootStore) {
        makeObservable(this, {
            timerMap: observable,
            isTimerRunning: observable,
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
                this.isTimerRunning = trackedTime
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
            this.isTimerRunning = await this.timerService.isTimerRunning(workspaceSlug)
        } catch (error) {
            throw error
        }
    }

    /**
     * Stop timer for an issue
     * @param workspaceSlug
     * @param projectId
     * @param issueId
     * @param timerId
     * @returns
     */
    stopIssueTimer = async (workspaceSlug: string, projectId: string, issueId: string, timerId: string) => {
        try {
            if (!this.isTimerRunning) return
            await this.timerService.stopIssueTimer(workspaceSlug, projectId, timerId)
            runInAction(() => {
                set(this.timerMap, issueId, [...(this.timerMap[issueId] || []), this.isTimerRunning])
                this.isTimerRunning = null
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
                    set(this.timerMap, time.issue_id, [...(this.timerMap[time.issue_id] || []), time])
                })
            })
        } catch (error) {
            throw error
        }
    }
}

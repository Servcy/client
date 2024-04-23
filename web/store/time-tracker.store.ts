import concat from "lodash/concat"
import pull from "lodash/pull"
import set from "lodash/set"
import uniq from "lodash/uniq"
import update from "lodash/update"
import { action, makeObservable, observable, runInAction } from "mobx"

import { TimeTrackerService } from "@services/time-tracker.service"

import { ITrackedTime, ITrackedTimeSnapshot } from "@servcy/types"

import { RootStore } from "./root.store"

export interface ITimeTrackerStore {
    timeTrackingMap: Record<string, ITrackedTime[]>
    runningTimeTracker: ITrackedTime | null
    startTrackingTime: (
        workspaceSlug: string,
        projectId: string,
        issueId: string,
        data: Partial<ITrackedTime>
    ) => Promise<void>
    loadingTimeSheet: boolean
    checkIsTimerRunning: (workspaceSlug: string) => Promise<void>
    stopTrackingTime: (workspaceSlug: string) => Promise<void>
    fetchTimeSheet: (workspaceSlug: string, queries?: any) => Promise<void>
    getTrackTimeByIssueId: (issueId: string) => ITrackedTime[]
    snapshots: Record<string, string[]>
    snapshotMap: Record<string, ITrackedTimeSnapshot>
    getSnapshotsByTimeTrackedId: (timeTrackedId: string) => string[]
    getSnapshotById: (snapshotId: string) => ITrackedTimeSnapshot | undefined
    addSnapshots: (timeTrackedId: string, snapshots: ITrackedTimeSnapshot[]) => void
    fetchSnapshots: (timeTrackedId: string) => Promise<ITrackedTimeSnapshot[]>
    createSnapshot: (timeTrackedId: string, data: FormData) => Promise<ITrackedTimeSnapshot>
    removeSnapshot: (timeTrackedId: string, snapshotId: string) => Promise<ITrackedTimeSnapshot>
}

export class TimeTrackerStore implements ITimeTrackerStore {
    timeTrackingMap: Record<string, ITrackedTime[]> = {}
    runningTimeTracker = null
    loadingTimeSheet = false
    snapshots: Record<string, string[]> = {}
    snapshotMap: Record<string, ITrackedTimeSnapshot> = {}
    router
    timeTrackerService

    constructor(_rootStore: RootStore) {
        makeObservable(this, {
            timeTrackingMap: observable,
            snapshots: observable,
            snapshotMap: observable,
            loadingTimeSheet: observable,
            runningTimeTracker: observable,
            createSnapshot: action,
            removeSnapshot: action,
            addSnapshots: action.bound,
            fetchSnapshots: action,
        })
        this.timeTrackerService = new TimeTrackerService()
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
    startTrackingTime = async (
        workspaceSlug: string,
        projectId: string,
        issueId: string,
        data: Partial<ITrackedTime>
    ) => {
        try {
            const trackedTime = await this.timeTrackerService.startTrackingTime(workspaceSlug, projectId, issueId, data)
            runInAction(() => {
                this.runningTimeTracker = trackedTime
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
            const response = await this.timeTrackerService.isTimerRunning(workspaceSlug)
            runInAction(() => {
                this.runningTimeTracker = response
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
            runInAction(() => {
                this.loadingTimeSheet = true
            })
            const timeSheet = await this.timeTrackerService.fetchTimeSheet(workspaceSlug, queries)
            timeSheet.forEach((trackedTime: ITrackedTime) => {
                runInAction(() => {
                    set(this.timeTrackingMap, trackedTime.issue, [
                        ...(this.timeTrackingMap[trackedTime.issue] || []),
                        trackedTime,
                    ])
                })
                if (trackedTime?.snapshots?.length > 0) this.addSnapshots(trackedTime.id, trackedTime.snapshots)
            })
        } catch (error) {
            throw error
        } finally {
            runInAction(() => {
                this.loadingTimeSheet = false
            })
        }
    }

    /**
     * Stop timer for an issue
     * @param workspaceSlug
     * @returns
     */
    stopTrackingTime = async (workspaceSlug: string) => {
        try {
            if (!this.runningTimeTracker) return
            const issueId = this.runningTimeTracker["issue"]
            const projectId = this.runningTimeTracker["project"]
            await this.timeTrackerService.stopTrackingTime(workspaceSlug, projectId, this.runningTimeTracker["id"])
            runInAction(() => {
                update(this.timeTrackingMap, [issueId], (trackedTimes = []) => [
                    ...trackedTimes,
                    this.runningTimeTracker,
                ])
                this.runningTimeTracker = null
            })
        } catch (error) {
            throw error
        }
    }

    getTrackTimeByIssueId = (issueId: string) => this.timeTrackingMap[issueId] ?? []

    getSnapshotsByTimeTrackedId = (timeTrackedId: string) => {
        if (!timeTrackedId) return []
        return this.snapshots[timeTrackedId] ?? []
    }

    getSnapshotById = (snapshotId: string) => {
        if (!snapshotId) return undefined
        return this.snapshotMap[snapshotId] ?? undefined
    }

    addSnapshots = (timeTrackedId: string, snapshots: ITrackedTimeSnapshot[]) => {
        if (snapshots && snapshots.length > 0) {
            const _snapshotIds = snapshots.map((snapshot) => snapshot.id)
            runInAction(() => {
                update(this.snapshots, [timeTrackedId], (snapshotIds = []) => uniq(concat(snapshotIds, _snapshotIds)))
                snapshots.forEach((snapshot) => set(this.snapshotMap, snapshot.id, snapshot))
            })
        }
    }

    fetchSnapshots = async (timeTrackedId: string) => {
        try {
            const response = await this.timeTrackerService.getTimeTrackedSnapshot(timeTrackedId)
            this.addSnapshots(timeTrackedId, response)
            return response
        } catch (error) {
            throw error
        }
    }

    createSnapshot = async (timeTrackedId: string, data: FormData) => {
        try {
            const response = await this.timeTrackerService.uploadTimeTrackedSnapshot(timeTrackedId, data)
            if (response && response.id)
                runInAction(() => {
                    update(this.snapshots, [timeTrackedId], (snapshotIds = []) =>
                        uniq(concat(snapshotIds, [response.id]))
                    )
                    set(this.snapshotMap, response.id, response)
                })
            return response
        } catch (error) {
            throw error
        }
    }

    removeSnapshot = async (timeTrackedId: string, snapshotId: string) => {
        try {
            const response = await this.timeTrackerService.deleteTimeTrackedSnapshot(timeTrackedId, snapshotId)
            runInAction(() => {
                update(this.snapshots, [timeTrackedId], (snapshotIds = []) => {
                    if (snapshotIds.includes(snapshotId)) pull(snapshotIds, snapshotId)
                    return snapshotIds
                })
                delete this.snapshotMap[snapshotId]
            })
            return response
        } catch (error) {
            throw error
        }
    }
}

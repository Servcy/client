import concat from "lodash/concat"
import pull from "lodash/pull"
import set from "lodash/set"
import uniq from "lodash/uniq"
import update from "lodash/update"
import { action, makeObservable, observable, runInAction } from "mobx"

import { TimeTrackerService } from "@services/time-tracker.service"

import { ITrackedTime, ITrackedTimeSnapshot, TIssue, TLoader } from "@servcy/types"

import { RootStore } from "./root.store"

export interface ITimeTrackerStore {
    timesheet: ITrackedTime[]
    runningTimeTracker?: ITrackedTime
    startTrackingTime: (
        workspaceSlug: string,
        projectId: string,
        issueId: string,
        data: Partial<ITrackedTime>
    ) => Promise<void>
    loader: TLoader
    checkIsTimerRunning: (workspaceSlug: string) => Promise<void>
    stopTrackingTime: (workspaceSlug: string) => Promise<void>
    deleteTimeLog: (workspaceSlug: string, projectId: string, timeLogId: string) => Promise<void>
    updateTimeLog: (
        workspaceSlug: string,
        projectId: string,
        timeLogId: string,
        data: Partial<ITrackedTime>
    ) => Promise<ITrackedTime>
    fetchTimeSheet: (workspaceSlug: string, viewId: string, queries?: any, loadType?: TLoader) => Promise<void>
    getTimeLogsByIssueId: (issueId: TIssue["id"]) => ITrackedTime[]
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
    timesheet: ITrackedTime[] = []
    runningTimeTracker?: ITrackedTime = undefined
    loader: TLoader = "init-loader"
    snapshots: Record<string, string[]> = {}
    snapshotMap: Record<string, ITrackedTimeSnapshot> = {}
    router
    timeTrackerService

    constructor(_rootStore: RootStore) {
        makeObservable(this, {
            timesheet: observable,
            snapshots: observable,
            snapshotMap: observable,
            loader: observable,
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
    fetchTimeSheet = async (
        workspaceSlug: string,
        viewId: string,
        queries?: any,
        loadType: TLoader = "init-loader"
    ) => {
        try {
            this.loader = loadType
            const timeSheet = await this.timeTrackerService.fetchTimeSheet(workspaceSlug, viewId, queries)
            runInAction(() => {
                this.timesheet = timeSheet
            })
            runInAction(() => {
                timeSheet
                    .filter((trackedTime: ITrackedTime) => trackedTime?.snapshots?.length > 0)
                    .forEach((trackedTime: ITrackedTime) => {
                        if (trackedTime?.snapshots?.length > 0) this.addSnapshots(trackedTime.id, trackedTime.snapshots)
                    })
            })
        } catch (error) {
            throw error
        } finally {
            runInAction(() => {
                this.loader = undefined
            })
        }
    }

    getTimeLogsByIssueId = (issueId: TIssue["id"]) => {
        if (!issueId) return []
        return this.timesheet.filter((trackedTime: ITrackedTime) => trackedTime.issue === issueId)
    }

    /**
     * Stop timer for an issue
     * @param workspaceSlug
     * @returns
     */
    stopTrackingTime = async (workspaceSlug: string) => {
        try {
            if (!this.runningTimeTracker) return
            const projectId = this.runningTimeTracker["project"]
            const trackedTime = await this.timeTrackerService.stopTrackingTime(
                workspaceSlug,
                projectId,
                this.runningTimeTracker["id"]
            )
            runInAction(() => {
                if (trackedTime) {
                    this.timesheet.push(trackedTime)
                }
                this.runningTimeTracker = undefined
            })
        } catch (error) {
            throw error
        }
    }

    deleteTimeLog = async (workspaceSlug: string, projectId: string, timeLogId: string) => {
        try {
            await this.timeTrackerService.deleteTimeLog(workspaceSlug, projectId, timeLogId)
            runInAction(() => {
                const index = this.timesheet.findIndex((timeLog) => timeLog.id === timeLogId)
                if (index !== -1) {
                    this.timesheet.splice(index, 1)
                }
            })
        } catch (error) {
            throw error
        }
    }

    updateTimeLog = async (
        workspaceSlug: string,
        projectId: string,
        timeLogId: string,
        data: Partial<ITrackedTime>
    ) => {
        try {
            const response = await this.timeTrackerService.updateTimeLog(workspaceSlug, projectId, timeLogId, data)
            runInAction(() => {
                const index = this.timesheet.findIndex((timeLog) => timeLog.id === timeLogId)
                if (index !== -1) {
                    this.timesheet[index] = response
                }
            })
            return response
        } catch (error) {
            throw error
        }
    }

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

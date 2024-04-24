import isArray from "lodash/isArray"
import isEmpty from "lodash/isEmpty"
import pickBy from "lodash/pickBy"
import set from "lodash/set"
import { action, makeObservable, observable, runInAction } from "mobx"

import { ITimesheetFilters, ITimesheetParams } from "@components/time-tracker"

import { EIssueFilterType, EIssuesStoreType } from "@constants/issue"

import { storage } from "@wrappers/common/LocalStorageWrapper"

import { RootStore } from "./root.store"

interface ILocalStoreTimesheetFilters {
    key: EIssuesStoreType
    workspaceSlug: string
    viewId: string | undefined
    userId: string | undefined
    filters: ITimesheetFilters
}

export interface ITimeTrackerFilter {
    filters: Record<"my-timesheet" | "workspace-timesheet" | string, ITimesheetFilters>
    getFilters: (viewId: string | undefined) => ITimesheetFilters | undefined
    getAppliedFilters: (viewId: string) => Partial<Record<ITimesheetParams, string | boolean>> | undefined
    fetchFilters: (workspaceSlug: string, viewId: string) => Promise<void>
    updateFilters: (workspaceSlug: string, filters: ITimesheetFilters, viewId?: string | undefined) => Promise<void>

    // utils
    computedFilteredParams(
        filters: ITimesheetFilters,
        filteredParams: ITimesheetParams[]
    ): Partial<Record<ITimesheetParams, string | boolean>>
}

export class TimeTrackerFilter implements ITimeTrackerFilter {
    filters: { [viewId: string]: ITimesheetFilters } = {}
    rootStore

    constructor(_rootStore: RootStore) {
        makeObservable(this, {
            filters: observable,
            getFilters: action,
            getAppliedFilters: action,
            fetchFilters: action,
            updateFilters: action,
        })
        this.rootStore = _rootStore
    }

    /**
     * @description This method is used to convert the filters array params to string params
     * @param {ITimesheetFilters} filters
     * @param {string[]} acceptableParamsByLayout
     * @returns {Partial<Record<ITimesheetParams, string | boolean>>}
     */
    computedFilteredParams = (filters: ITimesheetFilters, acceptableParamsByLayout: ITimesheetParams[]) => {
        const computedFilters: Partial<Record<ITimesheetParams, undefined | string[] | boolean | string>> = {
            created_by: filters?.created_by || undefined,
            project: filters.project || undefined,
            start_time: filters.start_time || undefined,
        }
        const timesheetFiltersParams: Partial<Record<ITimesheetParams, boolean | string>> = {}
        Object.keys(computedFilters).forEach((key) => {
            const _key = key as ITimesheetParams
            const _value: string | boolean | string[] | undefined = computedFilters[_key]
            if (_value != undefined && acceptableParamsByLayout.includes(_key))
                timesheetFiltersParams[_key] = Array.isArray(_value) ? _value.join(",") : _value
        })
        return timesheetFiltersParams
    }

    handleIssuesLocalFilters = {
        fetchFiltersFromStorage: () => {
            const _filters = storage.get("timesheet_local_filters")
            return _filters ? JSON.parse(_filters) : []
        },
        get: (
            currentView: EIssuesStoreType,
            workspaceSlug: string,
            viewId: string | undefined,
            userId: string | undefined
        ) => {
            const storageFilters = this.handleIssuesLocalFilters.fetchFiltersFromStorage()
            const currentFilterIndex = storageFilters.findIndex(
                (filter: ILocalStoreTimesheetFilters) =>
                    filter.key === currentView &&
                    filter.workspaceSlug === workspaceSlug &&
                    filter.viewId === viewId &&
                    filter.userId === userId
            )
            if (!currentFilterIndex && currentFilterIndex.length < 0) return undefined
            return storageFilters[currentFilterIndex]?.filters || {}
        },
        set: (
            currentView: EIssuesStoreType,
            filterType: EIssueFilterType,
            workspaceSlug: string,
            viewId: string | undefined,
            userId: string | undefined,
            filters: Partial<ITimesheetFilters>
        ) => {
            const storageFilters = this.handleIssuesLocalFilters.fetchFiltersFromStorage()
            const currentFilterIndex = storageFilters.findIndex(
                (filter: ILocalStoreTimesheetFilters) =>
                    filter.key === currentView &&
                    filter.workspaceSlug === workspaceSlug &&
                    filter.viewId === viewId &&
                    filter.userId === userId
            )

            if (currentFilterIndex < 0)
                storageFilters.push({
                    key: currentView,
                    workspaceSlug: workspaceSlug,
                    viewId: viewId,
                    userId: userId,
                    filters: filters,
                })
            else
                storageFilters[currentFilterIndex] = {
                    ...storageFilters[currentFilterIndex],
                    filters: {
                        ...storageFilters[currentFilterIndex].filters,
                        [filterType]: filters,
                    },
                }
            storage.set("timesheet_local_filters", JSON.stringify(storageFilters))
        },
    }

    /**
     * @description This method is used to apply the filters on the issues
     * @param {ITimesheetFilters} filters
     * @returns {ITimesheetFilters}
     */
    computedFilters = (filters: ITimesheetFilters): ITimesheetFilters => ({
        created_by: filters?.created_by || undefined,
        project: filters.project || undefined,
        start_time: filters.start_time || undefined,
    })

    getFilters = (viewId: string | undefined) => {
        if (!viewId) return undefined
        return this.filters[viewId]
    }

    getAppliedFilters = (viewId: string | undefined) => {
        if (!viewId) return undefined
        const selectedFilters = this.getFilters(viewId)
        if (!selectedFilters) return undefined
        const filteredParams: ITimesheetParams[] = [
            "created_by",
            "project",
            "start_time",
            "is_billable",
            "is_approved",
            "is_manually_added",
        ]
        const filteredRouteParams: Partial<Record<ITimesheetParams, string | boolean>> = this.computedFilteredParams(
            selectedFilters,
            filteredParams
        )
        return filteredRouteParams
    }

    fetchFilters = async (workspaceSlug: string, viewId: "my-timesheet" | "workspace-timesheet" | string) => {
        try {
            const currentUser = this.rootStore.user.currentUser
            const _filters = this.handleIssuesLocalFilters.get(
                EIssuesStoreType.GLOBAL,
                workspaceSlug,
                viewId,
                currentUser?.id
            )
            const filters = this.computedFilters(_filters)
            runInAction(() => {
                set(this.filters, [viewId], filters)
            })
        } catch (error) {
            throw error
        }
    }

    updateFilters = async (workspaceSlug: string, filters: ITimesheetFilters, viewId?: string) => {
        try {
            if (!viewId) throw new Error("View id is required")
            const timesheetFilters = this.getFilters(viewId)
            if (!timesheetFilters || isEmpty(filters)) return
            const updatedFilters = filters as ITimesheetFilters
            runInAction(() => {
                Object.keys(updatedFilters).forEach((_key) => {
                    set(this.filters, [viewId, _key], updatedFilters[_key as keyof ITimesheetFilters])
                })
            })
            const appliedFilters = { ...timesheetFilters, ...updatedFilters }
            const validatedFilters = pickBy(appliedFilters, (value) => value && isArray(value) && value.length > 0)
            this.rootStore.timeTracker.fetchTimeSheet(workspaceSlug, viewId, validatedFilters)
        } catch (error) {
            if (viewId) this.fetchFilters(workspaceSlug, viewId)
            throw error
        }
    }
}

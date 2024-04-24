import isEmpty from "lodash/isEmpty"
import set from "lodash/set"
import { action, makeObservable, observable, runInAction } from "mobx"

import { ETimesheetFilterType } from "@constants/timesheet"

import { storage } from "@wrappers/common/LocalStorageWrapper"

import {
    ILocalStoreTimesheetFilters,
    ITimesheetDisplayFilterOptions,
    ITimesheetDisplayPropertyOptions,
    ITimesheetFilter,
    ITimesheetFilterOptions,
    ITimesheetFilterResponse,
    ITimesheetParams,
} from "@servcy/types"

import { RootStore } from "./root.store"

export interface ITimeTrackerFilter {
    filters: Record<"my-timesheet" | "workspace-timesheet" | string, ITimesheetFilter>
    getFilters: (viewId: string | undefined) => ITimesheetFilter | undefined
    getAppliedFilters: (viewId: string) => Partial<Record<ITimesheetParams, string | boolean>> | undefined
    fetchFilters: (workspaceSlug: string, viewId: string) => Promise<void>
    updateFilters: (
        workspaceSlug: string,
        type: ETimesheetFilterType,
        filters: ITimesheetFilterOptions | ITimesheetDisplayFilterOptions | ITimesheetDisplayPropertyOptions,
        viewId?: string | undefined
    ) => Promise<void>
    computedFilteredParams(
        filters: ITimesheetFilterOptions,
        displayFilters: ITimesheetDisplayFilterOptions
    ): Partial<Record<ITimesheetParams, string | boolean>>
    computedFilters(filters: ITimesheetFilterOptions): ITimesheetFilterOptions
    computedDisplayFilters(
        displayFilters: ITimesheetDisplayFilterOptions,
        defaultValues?: ITimesheetDisplayFilterOptions
    ): ITimesheetDisplayFilterOptions
    computedDisplayProperties(filters: ITimesheetDisplayPropertyOptions): ITimesheetDisplayPropertyOptions
}

export class TimeTrackerFilter implements ITimeTrackerFilter {
    filters: { [viewId: string]: ITimesheetFilter } = {}
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

    computedFilteredParams = (filters: ITimesheetFilterOptions, displayFilters: ITimesheetDisplayFilterOptions) => {
        const acceptableParamsByLayout: ITimesheetParams[] = [
            "created_by",
            "project",
            "start_time",
            "is_billable",
            "is_approved",
            "is_manually_added",
        ]
        const computedFilters: Partial<Record<ITimesheetParams, undefined | string[] | boolean | string>> = {
            created_by: filters?.created_by || undefined,
            project: filters?.project || undefined,
            start_time: filters?.start_time || undefined,
            is_billable: displayFilters?.is_billable || undefined,
            is_approved: displayFilters?.is_approved || undefined,
            is_manually_added: displayFilters?.is_manually_added || undefined,
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

    handleTimesheetLocalFilters = {
        fetchFiltersFromStorage: () => {
            const _filters = storage.get("timesheet_local_filters")
            return _filters ? JSON.parse(_filters) : []
        },
        get: (workspaceSlug: string, viewId: string | undefined, userId: string | undefined) => {
            const storageFilters = this.handleTimesheetLocalFilters.fetchFiltersFromStorage()
            const currentFilterIndex = storageFilters.findIndex(
                (filter: ILocalStoreTimesheetFilters) =>
                    filter.workspaceSlug === workspaceSlug && filter.viewId === viewId && filter.userId === userId
            )
            if (!currentFilterIndex && currentFilterIndex.length < 0) return undefined
            return storageFilters[currentFilterIndex]?.filters || {}
        },
        set: (
            filterType: ETimesheetFilterType,
            workspaceSlug: string,
            viewId: string | undefined,
            userId: string | undefined,
            filters: Partial<ITimesheetFilterResponse>
        ) => {
            const storageFilters = this.handleTimesheetLocalFilters.fetchFiltersFromStorage()
            const currentFilterIndex = storageFilters.findIndex(
                (filter: ILocalStoreTimesheetFilters) =>
                    filter.workspaceSlug === workspaceSlug && filter.viewId === viewId && filter.userId === userId
            )

            if (currentFilterIndex < 0)
                storageFilters.push({
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
                        [filterType]: filters[filterType],
                    },
                }
            storage.set("timesheet_local_filters", JSON.stringify(storageFilters))
        },
    }

    computedFilters = (filters: ITimesheetFilterOptions): ITimesheetFilterOptions => ({
        created_by: filters?.created_by || undefined,
        project: filters.project || undefined,
        start_time: filters.start_time || undefined,
    })

    computedDisplayFilters = (
        displayFilters: ITimesheetDisplayFilterOptions,
        defaultValues?: ITimesheetDisplayFilterOptions
    ): ITimesheetDisplayFilterOptions => {
        const filters = displayFilters || defaultValues
        return {
            is_billable: filters?.is_billable,
            is_approved: filters?.is_approved,
            is_manually_added: filters?.is_manually_added,
        }
    }

    computedDisplayProperties = (
        displayProperties: ITimesheetDisplayPropertyOptions
    ): ITimesheetDisplayPropertyOptions => ({
        issue_id: displayProperties?.issue_id ?? true,
        description: displayProperties?.description ?? true,
        duration: displayProperties?.duration ?? true,
        start_time: displayProperties?.start_time ?? true,
        end_time: displayProperties?.end_time ?? true,
        created_by: displayProperties?.created_by ?? true,
        is_billable: displayProperties?.is_billable ?? true,
        is_approved: displayProperties?.is_approved ?? true,
        snapshots_count: displayProperties?.snapshots_count ?? true,
        is_manually_added: displayProperties?.is_manually_added ?? true,
    })

    getFilters = (viewId: string | undefined) => {
        if (!viewId) return undefined
        const filters = this.filters[viewId] || undefined
        if (isEmpty(filters)) return undefined
        const _filters: ITimesheetFilter = {
            filters: isEmpty(filters?.filters) ? undefined : filters?.filters,
            displayFilters: isEmpty(filters?.displayFilters) ? undefined : filters?.displayFilters,
            displayProperties: isEmpty(filters?.displayProperties) ? undefined : filters?.displayProperties,
        }
        return _filters
    }

    getAppliedFilters = (viewId: string | undefined) => {
        if (!viewId) return undefined
        const filters = this.getFilters(viewId)
        if (!filters) return undefined
        const filteredRouteParams: Partial<Record<ITimesheetParams, string | boolean>> = this.computedFilteredParams(
            filters?.filters as ITimesheetFilterOptions,
            filters?.displayFilters as ITimesheetDisplayFilterOptions
        )
        return filteredRouteParams
    }

    fetchFilters = async (workspaceSlug: string, viewId: "my-timesheet" | "workspace-timesheet" | string) => {
        try {
            const currentUser = this.rootStore.user.currentUser
            const _filters = this.handleTimesheetLocalFilters.get(workspaceSlug, viewId, currentUser?.id)
            const filters = this.computedFilters(_filters)
            const displayFilters: ITimesheetDisplayFilterOptions = this.computedDisplayFilters(_filters?.displayFilters)
            const displayProperties: ITimesheetDisplayPropertyOptions = this.computedDisplayProperties(
                _filters?.display_properties
            )
            runInAction(() => {
                set(this.filters, [viewId, "filters"], filters)
                set(this.filters, [viewId, "displayFilters"], displayFilters)
                set(this.filters, [viewId, "displayProperties"], displayProperties)
            })
        } catch (error) {
            throw error
        }
    }

    updateFilters = async (
        workspaceSlug: string,
        type: ETimesheetFilterType,
        filters: ITimesheetFilterOptions | ITimesheetDisplayFilterOptions | ITimesheetDisplayPropertyOptions,
        viewId?: string
    ) => {
        try {
            if (!viewId) throw new Error("View id is required")
            const timesheetFilters = this.getFilters(viewId)
            if (!timesheetFilters || isEmpty(filters)) return
            const currentUser = this.rootStore.user.currentUser
            const _filters = {
                filters: timesheetFilters.filters as ITimesheetFilterOptions,
                displayFilters: timesheetFilters.displayFilters as ITimesheetDisplayFilterOptions,
                displayProperties: timesheetFilters.displayProperties as ITimesheetDisplayPropertyOptions,
            }
            switch (type) {
                case ETimesheetFilterType.FILTERS:
                    const updatedFilters = filters as ITimesheetFilterOptions
                    _filters.filters = { ..._filters.filters, ...updatedFilters }
                    runInAction(() => {
                        Object.keys(updatedFilters).forEach((_key) => {
                            set(
                                this.filters,
                                [viewId, "filters", _key],
                                updatedFilters[_key as keyof ITimesheetFilterOptions]
                            )
                        })
                    })
                    const filteredRouteParams = this.computedFilteredParams(
                        _filters.filters as ITimesheetFilterOptions,
                        _filters.displayFilters as ITimesheetDisplayFilterOptions
                    )
                    this.rootStore.timeTracker.fetchTimeSheet(
                        workspaceSlug,
                        viewId,
                        filteredRouteParams,
                        isEmpty(_filters) ? "init-loader" : "mutation"
                    )
                    break
                case ETimesheetFilterType.DISPLAY_FILTERS:
                    const updatedDisplayFilters = filters as ITimesheetDisplayFilterOptions
                    _filters.displayFilters = { ..._filters.displayFilters, ...updatedDisplayFilters }
                    runInAction(() => {
                        Object.keys(updatedDisplayFilters).forEach((_key) => {
                            set(
                                this.filters,
                                [viewId, "displayFilters", _key],
                                updatedDisplayFilters[_key as keyof ITimesheetDisplayFilterOptions]
                            )
                        })
                    })
                    const filteredRouteParams2 = this.computedFilteredParams(
                        _filters.filters as ITimesheetFilterOptions,
                        _filters.displayFilters as ITimesheetDisplayFilterOptions
                    )
                    this.rootStore.timeTracker.fetchTimeSheet(workspaceSlug, viewId, filteredRouteParams2, "mutation")
                    this.handleTimesheetLocalFilters.set(type, workspaceSlug, currentUser?.id, viewId, {
                        displayFilters: _filters.displayFilters,
                    })
                    break
                case ETimesheetFilterType.DISPLAY_PROPERTIES:
                    const updatedDisplayProperties = filters as ITimesheetDisplayPropertyOptions
                    _filters.displayProperties = { ..._filters.displayProperties, ...updatedDisplayProperties }
                    runInAction(() => {
                        Object.keys(updatedDisplayProperties).forEach((_key) => {
                            set(
                                this.filters,
                                [viewId, "displayProperties", _key],
                                updatedDisplayProperties[_key as keyof ITimesheetDisplayPropertyOptions]
                            )
                        })
                    })
                    this.handleTimesheetLocalFilters.set(type, workspaceSlug, currentUser?.id, viewId, {
                        displayProperties: _filters.displayProperties,
                    })
                default:
                    break
            }
        } catch (error) {
            if (viewId) this.fetchFilters(workspaceSlug, viewId)
            throw error
        }
    }
}

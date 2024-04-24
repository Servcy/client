import { useParams } from "next/navigation"

import { X } from "lucide-react"
import { observer } from "mobx-react-lite"

import { AppliedDateFilters, AppliedMembersFilters, AppliedProjectFilters } from "@components/issues"

import { useTimeTrackerFilter } from "@hooks/store"

import { ETimesheetFilterType } from "@constants/timesheet"

import { replaceUnderscoreIfSnakeCase } from "@helpers/string.helper"

import { ITimesheetFilterOptions } from "@servcy/types"

export const TimesheetAppliedFilters = observer(({ viewKey }: { viewKey: string }) => {
    const { workspaceSlug } = useParams()
    const { filters, updateFilters } = useTimeTrackerFilter()
    const userFilters = filters?.[viewKey]?.filters
    // filters whose value not null or empty array
    let appliedFilters: ITimesheetFilterOptions | undefined = undefined
    Object.entries(userFilters ?? {}).forEach(([key, value]) => {
        if (!value) return
        if (Array.isArray(value) && value.length === 0) return
        if (!appliedFilters) appliedFilters = {}
        appliedFilters[key as keyof ITimesheetFilterOptions] = value
    })
    const handleRemoveFilter = (key: keyof ITimesheetFilterOptions, value: string | null) => {
        if (!workspaceSlug || !viewKey) return
        if (!value) {
            updateFilters(workspaceSlug.toString(), ETimesheetFilterType.FILTERS, { [key]: null }, viewKey.toString())
            return
        }
        let newValues = userFilters?.[key] ?? []
        newValues = newValues.filter((val) => val !== value)
        updateFilters(workspaceSlug.toString(), ETimesheetFilterType.FILTERS, { [key]: newValues }, viewKey.toString())
    }
    const handleClearAllFilters = () => {
        if (!workspaceSlug || !viewKey) return
        const newFilters: ITimesheetFilterOptions = {}
        Object.keys(userFilters ?? {}).forEach((key) => {
            newFilters[key as keyof ITimesheetFilterOptions] = []
        })
        updateFilters(workspaceSlug.toString(), ETimesheetFilterType.FILTERS, { ...newFilters }, viewKey.toString())
    }
    if (!appliedFilters) return null
    if (Object.keys(appliedFilters).length === 0) return null
    return (
        <div className="flex items-start justify-between gap-4 p-4">
            <div className="flex flex-wrap items-stretch gap-2 bg-custom-background-100">
                {Object.entries(appliedFilters).map(([key, value]) => {
                    const filterKey = key as keyof ITimesheetFilterOptions
                    if (!value) return
                    return (
                        <div
                            key={filterKey}
                            className="flex flex-wrap items-center gap-2 rounded-md border border-custom-border-200 px-2 py-1 capitalize"
                        >
                            <span className="text-xs text-custom-text-300">
                                {replaceUnderscoreIfSnakeCase(filterKey)}
                            </span>
                            <div className="flex flex-wrap items-center gap-1.5">
                                {filterKey === "created_by" && (
                                    <AppliedMembersFilters
                                        editable={true}
                                        handleRemove={(val) => handleRemoveFilter(filterKey, val)}
                                        values={value as string[]}
                                    />
                                )}
                                {filterKey === "start_time" && (
                                    <AppliedDateFilters
                                        handleRemove={(val) => handleRemoveFilter(filterKey, val)}
                                        values={value as string[]}
                                    />
                                )}
                                {filterKey === "project" && (
                                    <AppliedProjectFilters
                                        editable={true}
                                        handleRemove={(val) => handleRemoveFilter("project", val)}
                                        values={value as string[]}
                                    />
                                )}
                                <button
                                    type="button"
                                    className="grid place-items-center text-custom-text-300 hover:text-custom-text-200"
                                    onClick={() => handleRemoveFilter(filterKey, null)}
                                >
                                    <X size={12} strokeWidth={2} />
                                </button>
                            </div>
                        </div>
                    )
                })}
                <button
                    type="button"
                    onClick={handleClearAllFilters}
                    className="flex items-center gap-2 rounded-md border border-custom-border-200 px-2 py-1 text-xs text-custom-text-300 hover:text-custom-text-200"
                >
                    Clear all
                    <X size={12} strokeWidth={2} />
                </button>
            </div>
        </div>
    )
})

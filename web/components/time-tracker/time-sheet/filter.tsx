import { useState } from "react"

import { Search, X } from "lucide-react"
import { observer } from "mobx-react-lite"

import { FilterCreatedBy, FilterProjects, FilterStartDate } from "@components/issues"

import { ITimesheetFilters } from "@servcy/types"

type ITimesheetFilterSelection = {
    filters: ITimesheetFilters
    handleFiltersUpdate: (key: keyof ITimesheetFilters, value: string | string[]) => void
    memberIds?: string[] | undefined
}

export const TimesheetFilterSelection: React.FC<ITimesheetFilterSelection> = observer((props) => {
    const { filters, handleFiltersUpdate, memberIds } = props
    const [filtersSearchQuery, setFiltersSearchQuery] = useState("")

    return (
        <div className="flex h-full w-full flex-col overflow-hidden">
            <div className="bg-custom-background-100 p-2.5 pb-0">
                <div className="flex items-center gap-1.5 rounded border-[0.5px] border-custom-border-200 bg-custom-background-90 px-1.5 py-1 text-xs">
                    <Search className="text-custom-text-400" size={12} strokeWidth={2} />
                    <input
                        type="text"
                        className="w-full bg-custom-background-90 outline-none placeholder:text-custom-text-400"
                        placeholder="Search"
                        value={filtersSearchQuery}
                        onChange={(e) => setFiltersSearchQuery(e.target.value)}
                        autoFocus
                    />
                    {filtersSearchQuery !== "" && (
                        <button
                            type="button"
                            className="grid place-items-center"
                            onClick={() => setFiltersSearchQuery("")}
                        >
                            <X className="text-custom-text-300" size={12} strokeWidth={2} />
                        </button>
                    )}
                </div>
            </div>
            <div className="h-full w-full divide-y divide-custom-border-200 overflow-y-auto px-2.5">
                {/* created_by */}
                <div className="py-2">
                    <FilterCreatedBy
                        appliedFilters={filters.created_by ?? null}
                        handleUpdate={(val) => handleFiltersUpdate("created_by", val)}
                        memberIds={memberIds}
                        searchQuery={filtersSearchQuery}
                    />
                </div>

                {/* project */}
                <div className="py-2">
                    <FilterProjects
                        appliedFilters={filters.project ?? null}
                        handleUpdate={(val) => handleFiltersUpdate("project", val)}
                        searchQuery={filtersSearchQuery}
                    />
                </div>

                {/* start_time */}
                <div className="py-2">
                    <FilterStartDate
                        appliedFilters={filters.start_time ?? null}
                        handleUpdate={(val) => handleFiltersUpdate("start_time", val)}
                        searchQuery={filtersSearchQuery}
                        title="Tracked on"
                    />
                </div>
            </div>
        </div>
    )
})

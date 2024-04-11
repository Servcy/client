import { useParams } from "next/navigation"

import { observer } from "mobx-react-lite"

import { AppliedFiltersList, SaveFilterView } from "@components/issues"

import { useIssues, useLabel, useProjectState } from "@hooks/store"

import { EIssueFilterType, EIssuesStoreType } from "@constants/issue"

import { IIssueFilterOptions } from "@servcy/types"

export const ModuleAppliedFiltersRoot: React.FC = observer(() => {
    const { workspaceSlug, projectId, moduleId } = useParams() as {
        workspaceSlug: string
        projectId: string
        moduleId: string
    }
    // store hooks
    const {
        issuesFilter: { issueFilters, updateFilters },
    } = useIssues(EIssuesStoreType.MODULE)
    const { projectLabels } = useLabel()
    const { projectStates } = useProjectState()
    // derived values
    const userFilters = issueFilters?.filters
    // filters whose value not null or empty array
    const appliedFilters: IIssueFilterOptions = {}
    Object.entries(userFilters ?? {}).forEach(([key, value]) => {
        if (!value) return
        if (Array.isArray(value) && value.length === 0) return
        appliedFilters[key as keyof IIssueFilterOptions] = value
    })

    const handleRemoveFilter = (key: keyof IIssueFilterOptions, value: string | null) => {
        if (!workspaceSlug || !projectId || !moduleId) return
        if (!value) {
            updateFilters(
                workspaceSlug,
                projectId,
                EIssueFilterType.FILTERS,
                {
                    [key]: null,
                },
                moduleId
            )
            return
        }

        let newValues = issueFilters?.filters?.[key] ?? []
        newValues = newValues.filter((val) => val !== value)

        updateFilters(
            workspaceSlug,
            projectId,
            EIssueFilterType.FILTERS,
            {
                [key]: newValues,
            },
            moduleId
        )
    }

    const handleClearAllFilters = () => {
        if (!workspaceSlug || !projectId || !moduleId) return
        const newFilters: IIssueFilterOptions = {}
        Object.keys(userFilters ?? {}).forEach((key) => {
            newFilters[key as keyof IIssueFilterOptions] = []
        })
        updateFilters(workspaceSlug, projectId, EIssueFilterType.FILTERS, { ...newFilters }, moduleId)
    }

    // return if no filters are applied
    if (Object.keys(appliedFilters).length === 0) return null

    return (
        <div className="flex items-center justify-between p-4 gap-2.5">
            <AppliedFiltersList
                appliedFilters={appliedFilters}
                handleClearAllFilters={handleClearAllFilters}
                handleRemoveFilter={handleRemoveFilter}
                labels={projectLabels ?? []}
                states={projectStates}
            />

            <SaveFilterView workspaceSlug={workspaceSlug} projectId={projectId} filterParams={appliedFilters} />
        </div>
    )
})

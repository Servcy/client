import { useParams } from "next/navigation"

import { observer } from "mobx-react-lite"

import { AppliedFiltersList, SaveFilterView } from "@components/issues"

import { useIssues, useLabel, useProjectState } from "@hooks/store"

import { EIssueFilterType, EIssuesStoreType } from "@constants/issue"

import { IIssueFilterOptions } from "@servcy/types"

export const ArchivedIssueAppliedFiltersRoot: React.FC = observer(() => {

    const { workspaceSlug, projectId } = useParams() as { workspaceSlug: string; projectId: string }
    // store hooks

    const {
        issuesFilter: { issueFilters, updateFilters },
    } = useIssues(EIssuesStoreType.ARCHIVED)
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
        if (!workspaceSlug || !projectId) return

        // remove all values of the key if value is null
        if (!value) {
            updateFilters(workspaceSlug.toString(), projectId.toString(), EIssueFilterType.FILTERS, {
                [key]: null,
            })
            return
        }

        // remove the passed value from the key
        let newValues = issueFilters?.filters?.[key] ?? []
        newValues = newValues.filter((val) => val !== value)

        updateFilters(workspaceSlug.toString(), projectId.toString(), EIssueFilterType.FILTERS, {
            [key]: newValues,
        })
    }

    const handleClearAllFilters = () => {
        if (!workspaceSlug || !projectId) return

        const newFilters: IIssueFilterOptions = {}
        Object.keys(userFilters ?? {}).forEach((key) => {
            newFilters[key as keyof IIssueFilterOptions] = null
        })

        updateFilters(workspaceSlug.toString(), projectId.toString(), EIssueFilterType.FILTERS, {
            ...newFilters,
        })
    }

    // return if no filters are applied
    if (Object.keys(appliedFilters).length === 0) return null

    return (
        <div className="flex items-center justify-between p-4">
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

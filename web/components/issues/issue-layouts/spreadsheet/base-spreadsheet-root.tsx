import { useParams } from "next/navigation"

import { FC, useCallback } from "react"

import { observer } from "mobx-react-lite"

import { useUser } from "@hooks/store"

import { EIssueFilterType } from "@constants/issue"
import { EUserProjectRoles } from "@constants/project"

import { ICycleIssues, ICycleIssuesFilter } from "@store/issue/cycle"
import { IModuleIssues, IModuleIssuesFilter } from "@store/issue/module"
import { IProjectIssues, IProjectIssuesFilter } from "@store/issue/project"
import { IProjectViewIssues, IProjectViewIssuesFilter } from "@store/issue/project-views"

import { IIssueDisplayFilterOptions, TIssue, TUnGroupedIssues } from "@servcy/types"

import { IQuickActionProps } from "../list/list-view-types"
import { EIssueActions } from "../types"
// views
import { SpreadsheetView } from "./spreadsheet-view"

interface IBaseSpreadsheetRoot {
    issueFiltersStore: IProjectIssuesFilter | IModuleIssuesFilter | ICycleIssuesFilter | IProjectViewIssuesFilter
    issueStore: IProjectIssues | ICycleIssues | IModuleIssues | IProjectViewIssues
    viewId?: string
    QuickActions: FC<IQuickActionProps>
    issueActions: {
        [EIssueActions.DELETE]: (issue: TIssue) => void
        [EIssueActions.UPDATE]?: (issue: TIssue) => void
        [EIssueActions.REMOVE]?: (issue: TIssue) => void
        [EIssueActions.ARCHIVE]?: (issue: TIssue) => void
        [EIssueActions.RESTORE]?: (issue: TIssue) => Promise<void>
    }
    canEditPropertiesBasedOnProject?: (projectId: string) => boolean
    isCompletedCycle?: boolean
}

export const BaseSpreadsheetRoot = observer((props: IBaseSpreadsheetRoot) => {
    const {
        issueFiltersStore,
        issueStore,
        viewId,
        QuickActions,
        issueActions,
        canEditPropertiesBasedOnProject,
        isCompletedCycle = false,
    } = props
    const { workspaceSlug, projectId } = useParams() as { workspaceSlug: string; projectId: string }
    // store hooks
    const {
        membership: { currentProjectRole },
    } = useUser()
    // derived values
    const { enableInlineEditing, enableQuickAdd, enableIssueCreation } = issueStore?.viewFlags || {}
    // user role validation
    const isEditingAllowed = !!currentProjectRole && currentProjectRole >= EUserProjectRoles.MEMBER

    const canEditProperties = useCallback(
        (projectId: string | undefined) => {
            const isEditingAllowedBasedOnProject =
                canEditPropertiesBasedOnProject && projectId
                    ? canEditPropertiesBasedOnProject(projectId)
                    : isEditingAllowed

            return enableInlineEditing && isEditingAllowedBasedOnProject
        },
        [canEditPropertiesBasedOnProject, enableInlineEditing, isEditingAllowed]
    )

    const issueIds = (issueStore.groupedIssueIds ?? []) as TUnGroupedIssues

    const handleIssues = useCallback(
        async (issue: TIssue, action: EIssueActions) => {
            if (issueActions[action]) {
                issueActions[action]!(issue)
            }
        },
        [issueActions]
    )

    const handleDisplayFiltersUpdate = useCallback(
        (updatedDisplayFilter: Partial<IIssueDisplayFilterOptions>) => {
            if (!workspaceSlug || !projectId) return

            issueFiltersStore.updateFilters(
                workspaceSlug,
                projectId,
                EIssueFilterType.DISPLAY_FILTERS,
                {
                    ...updatedDisplayFilter,
                },
                viewId
            )
        },
        [issueFiltersStore?.updateFilters, projectId, workspaceSlug, viewId]
    )

    const renderQuickActions = useCallback(
        (issue: TIssue, customActionButton?: React.ReactElement, portalElement?: HTMLDivElement | null) => (
            <QuickActions
                customActionButton={customActionButton}
                issue={issue}
                handleDelete={async () => handleIssues(issue, EIssueActions.DELETE)}
                handleUpdate={
                    issueActions[EIssueActions.UPDATE]
                        ? async (data) => handleIssues(data, EIssueActions.UPDATE)
                        : undefined
                }
                handleRemoveFromView={
                    issueActions[EIssueActions.REMOVE]
                        ? async () => handleIssues(issue, EIssueActions.REMOVE)
                        : undefined
                }
                handleArchive={
                    issueActions[EIssueActions.ARCHIVE]
                        ? async () => handleIssues(issue, EIssueActions.ARCHIVE)
                        : undefined
                }
                handleRestore={
                    issueActions[EIssueActions.RESTORE]
                        ? async () => handleIssues(issue, EIssueActions.RESTORE)
                        : undefined
                }
                portalElement={portalElement}
                readOnly={!isEditingAllowed || isCompletedCycle}
            />
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [handleIssues]
    )

    return (
        <SpreadsheetView
            displayProperties={issueFiltersStore.issueFilters?.displayProperties ?? {}}
            displayFilters={issueFiltersStore.issueFilters?.displayFilters ?? {}}
            handleDisplayFilterUpdate={handleDisplayFiltersUpdate}
            issueIds={issueIds}
            quickActions={renderQuickActions}
            handleIssues={handleIssues}
            canEditProperties={canEditProperties}
            quickAddCallback={issueStore.quickAddIssue}
            viewId={viewId}
            enableQuickCreateIssue={enableQuickAdd}
            disableIssueCreation={!enableIssueCreation || !isEditingAllowed || isCompletedCycle}
        />
    )
})

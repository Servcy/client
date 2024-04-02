import { useParams } from "next/navigation"

import { useCallback, useState } from "react"

import { PlusIcon } from "lucide-react"
import { observer } from "mobx-react-lite"

import { BreadcrumbLink } from "@components/common"
import { SidebarHamburgerToggle } from "@components/core/sidebar/sidebar-menu-hamburger-toggle"
import { DisplayFiltersSelection, FiltersDropdown, FilterSelection } from "@components/issues"
import { CreateUpdateWorkspaceViewModal } from "@components/workspace"

import { useIssues, useLabel, useMember, useUser } from "@hooks/store"

import { ERoles } from "@constants/iam"
import { EIssueFilterType, EIssuesStoreType, ISSUE_DISPLAY_FILTERS_BY_LAYOUT } from "@constants/issue"

import { IIssueDisplayFilterOptions, IIssueDisplayProperties, IIssueFilterOptions } from "@servcy/types"
import { Breadcrumbs, Button, LayersIcon, PhotoFilterIcon } from "@servcy/ui"

type Props = {
    activeLayout: "list" | "spreadsheet"
}

export const GlobalIssuesHeader: React.FC<Props> = observer((props) => {
    const { activeLayout } = props
    // states
    const [createViewModal, setCreateViewModal] = useState(false)
    const { workspaceSlug, globalViewId } = useParams()
    // store hooks
    const {
        issuesFilter: { filters, updateFilters },
    } = useIssues(EIssuesStoreType.GLOBAL)
    const {
        membership: { currentWorkspaceRole },
    } = useUser()
    const { workspaceLabels } = useLabel()
    const {
        workspace: { workspaceMemberIds },
    } = useMember()

    const issueFilters = globalViewId ? filters[globalViewId.toString()] : undefined

    const handleFiltersUpdate = useCallback(
        (key: keyof IIssueFilterOptions, value: string | string[]) => {
            if (!workspaceSlug || !globalViewId) return
            const newValues = issueFilters?.filters?.[key] ?? []

            if (Array.isArray(value)) {
                value.forEach((val) => {
                    if (!newValues.includes(val)) newValues.push(val)
                })
            } else {
                if (issueFilters?.filters?.[key]?.includes(value)) newValues.splice(newValues.indexOf(value), 1)
                else newValues.push(value)
            }

            updateFilters(
                workspaceSlug.toString(),
                undefined,
                EIssueFilterType.FILTERS,
                { [key]: newValues },
                globalViewId.toString()
            )
        },
        [workspaceSlug, issueFilters, updateFilters, globalViewId]
    )

    const handleDisplayFilters = useCallback(
        (updatedDisplayFilter: Partial<IIssueDisplayFilterOptions>) => {
            if (!workspaceSlug || !globalViewId) return
            updateFilters(
                workspaceSlug.toString(),
                undefined,
                EIssueFilterType.DISPLAY_FILTERS,
                updatedDisplayFilter,
                globalViewId.toString()
            )
        },
        [workspaceSlug, updateFilters, globalViewId]
    )

    const handleDisplayProperties = useCallback(
        (property: Partial<IIssueDisplayProperties>) => {
            if (!workspaceSlug || !globalViewId) return
            updateFilters(
                workspaceSlug.toString(),
                undefined,
                EIssueFilterType.DISPLAY_PROPERTIES,
                property,
                globalViewId.toString()
            )
        },
        [workspaceSlug, updateFilters, globalViewId]
    )

    const isAuthorizedUser = currentWorkspaceRole !== undefined && currentWorkspaceRole >= ERoles.MEMBER

    return (
        <>
            <CreateUpdateWorkspaceViewModal isOpen={createViewModal} onClose={() => setCreateViewModal(false)} />
            <div className="relative z-[15] flex h-[3.75rem] w-full items-center justify-between gap-x-2 gap-y-4 border-b border-custom-border-200 bg-custom-sidebar-background-100 p-4">
                <div className="relative flex gap-2">
                    <SidebarHamburgerToggle />
                    <Breadcrumbs>
                        <Breadcrumbs.BreadcrumbItem
                            type="text"
                            link={
                                <BreadcrumbLink
                                    label={`All ${activeLayout === "spreadsheet" ? "Issues" : "Views"}`}
                                    icon={
                                        activeLayout === "spreadsheet" ? (
                                            <LayersIcon className="h-4 w-4 text-custom-text-300" />
                                        ) : (
                                            <PhotoFilterIcon className="h-4 w-4 text-custom-text-300" />
                                        )
                                    }
                                />
                            }
                        />
                    </Breadcrumbs>
                </div>
                <div className="flex items-center gap-2">
                    {activeLayout === "spreadsheet" && (
                        <>
                            <FiltersDropdown title="Filters" placement="bottom-end">
                                <FilterSelection
                                    layoutDisplayFiltersOptions={ISSUE_DISPLAY_FILTERS_BY_LAYOUT.my_issues.spreadsheet}
                                    filters={issueFilters?.filters ?? {}}
                                    handleFiltersUpdate={handleFiltersUpdate}
                                    labels={workspaceLabels ?? undefined}
                                    memberIds={workspaceMemberIds ?? undefined}
                                />
                            </FiltersDropdown>
                            <FiltersDropdown title="Display" placement="bottom-end">
                                <DisplayFiltersSelection
                                    layoutDisplayFiltersOptions={ISSUE_DISPLAY_FILTERS_BY_LAYOUT.my_issues.spreadsheet}
                                    displayFilters={issueFilters?.displayFilters ?? {}}
                                    handleDisplayFiltersUpdate={handleDisplayFilters}
                                    displayProperties={issueFilters?.displayProperties ?? {}}
                                    handleDisplayPropertiesUpdate={handleDisplayProperties}
                                />
                            </FiltersDropdown>
                        </>
                    )}
                    {isAuthorizedUser && (
                        <Button
                            variant="primary"
                            size="sm"
                            prependIcon={<PlusIcon />}
                            onClick={() => setCreateViewModal(true)}
                        >
                            New View
                        </Button>
                    )}
                </div>
            </div>
        </>
    )
})

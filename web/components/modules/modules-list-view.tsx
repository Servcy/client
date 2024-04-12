import Image from "next/image"
import { useParams } from "next/navigation"

import { observer } from "mobx-react-lite"
import { useTheme } from "next-themes"
import AllFiltersImage from "public/empty-state/module/all-filters.svg"
import NameFilterImage from "public/empty-state/module/name-filter.svg"

import { EmptyState, getEmptyStateImagePath } from "@components/empty-state"
import { ModuleCardItem, ModuleListItem, ModulePeekOverview, ModulesListGanttChartView } from "@components/modules"
import { CycleModuleBoardLayout, CycleModuleListLayout, GanttLayoutLoader } from "@components/ui"

import { useApplication, useEventTracker, useModule, useModuleFilter, useUser } from "@hooks/store"

import { MODULE_EMPTY_STATE_DETAILS } from "@constants/empty-state"
import { ERoles } from "@constants/iam"

export const ModulesListView: React.FC = observer(() => {
    const { workspaceSlug, projectId, peekModule } = useParams()
    // theme
    const { resolvedTheme } = useTheme()
    // store hooks
    const { commandPalette: commandPaletteStore } = useApplication()
    const { setTrackElement } = useEventTracker()
    const {
        membership: { currentProjectRole },
        currentUser,
    } = useUser()
    const { getFilteredModuleIds, loader } = useModule()
    const isLightMode = resolvedTheme ? resolvedTheme === "light" : currentUser?.theme.theme === "light"
    const EmptyStateImagePath = getEmptyStateImagePath("onboarding", "modules", isLightMode)
    const isEditingAllowed = currentProjectRole !== undefined && currentProjectRole >= ERoles.MEMBER
    const { currentProjectDisplayFilters: displayFilters, searchQuery } = useModuleFilter()
    const filteredModuleIds = projectId ? getFilteredModuleIds(projectId.toString()) : undefined

    if (loader || !filteredModuleIds)
        return (
            <>
                {displayFilters?.layout === "list" && <CycleModuleListLayout />}
                {displayFilters?.layout === "board" && <CycleModuleBoardLayout />}
                {displayFilters?.layout === "gantt" && <GanttLayoutLoader />}
            </>
        )
    if (filteredModuleIds.length === 0)
        return (
            <div className="h-full w-full grid place-items-center">
                <div className="text-center">
                    <Image
                        src={searchQuery.trim() === "" ? AllFiltersImage : NameFilterImage}
                        className="h-36 sm:h-48 w-36 sm:w-48 mx-auto"
                        alt="No matching modules"
                    />
                    <h5 className="text-xl font-medium mt-7 mb-1">No matching modules</h5>
                    <p className="text-custom-text-400 text-base">
                        {searchQuery.trim() === ""
                            ? "Remove the filters to see all modules"
                            : "Remove the search criteria to see all modules"}
                    </p>
                </div>
            </div>
        )

    return (
        <>
            {filteredModuleIds.length > 0 ? (
                <>
                    {displayFilters?.layout === "list" && (
                        <div className="h-full overflow-y-auto">
                            <div className="flex h-full w-full justify-between">
                                <div className="flex h-full w-full flex-col overflow-y-auto vertical-scrollbar scrollbar-lg">
                                    {filteredModuleIds.map((moduleId) => (
                                        <ModuleListItem key={moduleId} moduleId={moduleId} />
                                    ))}
                                </div>
                                <ModulePeekOverview
                                    projectId={projectId?.toString() ?? ""}
                                    workspaceSlug={workspaceSlug?.toString() ?? ""}
                                />
                            </div>
                        </div>
                    )}
                    {displayFilters?.layout === "board" && (
                        <div className="h-full w-full">
                            <div className="flex h-full w-full justify-between">
                                <div
                                    className={`grid h-full w-full grid-cols-1 gap-6 overflow-y-auto p-8 ${
                                        peekModule
                                            ? "lg:grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3"
                                            : "lg:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4"
                                    } auto-rows-max transition-all vertical-scrollbar scrollbar-lg`}
                                >
                                    {filteredModuleIds.map((moduleId) => (
                                        <ModuleCardItem key={moduleId} moduleId={moduleId} />
                                    ))}
                                </div>
                                <ModulePeekOverview
                                    projectId={projectId?.toString() ?? ""}
                                    workspaceSlug={workspaceSlug?.toString() ?? ""}
                                />
                            </div>
                        </div>
                    )}
                    {displayFilters?.layout === "gantt" && <ModulesListGanttChartView />}
                </>
            ) : (
                <EmptyState
                    title={MODULE_EMPTY_STATE_DETAILS["modules"].title}
                    description={MODULE_EMPTY_STATE_DETAILS["modules"].description}
                    image={EmptyStateImagePath}
                    comicBox={{
                        title: MODULE_EMPTY_STATE_DETAILS["modules"].comicBox.title,
                        description: MODULE_EMPTY_STATE_DETAILS["modules"].comicBox.description,
                    }}
                    primaryButton={{
                        text: MODULE_EMPTY_STATE_DETAILS["modules"].primaryButton.text,
                        onClick: () => {
                            setTrackElement("Module empty state")
                            commandPaletteStore.toggleCreateModuleModal(true)
                        },
                    }}
                    size="lg"
                    disabled={!isEditingAllowed}
                />
            )}
        </>
    )
})

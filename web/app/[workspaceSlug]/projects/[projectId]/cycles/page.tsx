"use client"

import { useParams, useSearchParams } from "next/navigation"

import { Fragment, useState } from "react"

import { Tab } from "@headlessui/react"
import { observer } from "mobx-react-lite"
import { useTheme } from "next-themes"

import { PageHead } from "@components/core"
import {
    ActiveCycleRoot,
    CycleAppliedFiltersList,
    CycleCreateUpdateModal,
    CyclesView,
    CyclesViewHeader,
} from "@components/cycles"
import { EmptyState, getEmptyStateImagePath } from "@components/empty-state"
import { CyclesHeader } from "@components/headers"
import { CycleModuleBoardLayout, CycleModuleListLayout, GanttLayoutLoader } from "@components/ui"

import { useCycle, useCycleFilter, useEventTracker, useProject, useUser } from "@hooks/store"

import { CYCLE_TABS_LIST } from "@constants/cycle"
import { CYCLE_EMPTY_STATE_DETAILS } from "@constants/empty-state"
import { ERoles } from "@constants/iam"

import { AppWrapper } from "@wrappers/app"

import { calculateTotalFilters } from "@helpers/filter.helper"

import { TCycleFilters } from "@servcy/types"

const ProjectCyclesPage = observer(() => {
    const [createModal, setCreateModal] = useState(false)
    // theme
    const { resolvedTheme } = useTheme()
    // store hooks
    const { setTrackElement } = useEventTracker()
    const {
        membership: { currentProjectRole },
        currentUser,
    } = useUser()
    const { currentProjectCycleIds, loader } = useCycle()
    const { getProjectById } = useProject()

    const { workspaceSlug, projectId } = useParams()
    const searchParams = useSearchParams()
    // derived values
    const isLightMode = resolvedTheme ? resolvedTheme === "light" : currentUser?.theme.theme === "light"
    const EmptyStateImagePath = getEmptyStateImagePath("onboarding", "cycles", isLightMode)
    const totalCycles = currentProjectCycleIds?.length ?? 0
    const isEditingAllowed = currentProjectRole !== undefined && currentProjectRole >= ERoles.MEMBER
    const project = projectId ? getProjectById(projectId?.toString()) : undefined
    const pageTitle = project?.name ? `${project?.name} - Cycles` : undefined
    const {
        clearAllFilters,
        currentProjectDisplayFilters,
        currentProjectFilters,
        updateDisplayFilters,
        updateFilters,
    } = useCycleFilter()
    const cycleTab = currentProjectDisplayFilters?.active_tab
    const cycleLayout = currentProjectDisplayFilters?.layout
    const handleRemoveFilter = (key: keyof TCycleFilters, value: string | null) => {
        if (!projectId) return
        let newValues = currentProjectFilters?.[key] ?? []

        if (!value) newValues = []
        else newValues = newValues.filter((val) => val !== value)

        updateFilters(projectId.toString(), { [key]: newValues })
    }

    if (!workspaceSlug || !projectId) return null

    return (
        <AppWrapper header={<CyclesHeader />} withProjectWrapper>
            <PageHead title={pageTitle} />
            <div className="w-full h-full">
                <CycleCreateUpdateModal
                    workspaceSlug={workspaceSlug.toString()}
                    projectId={projectId.toString()}
                    isOpen={createModal}
                    handleClose={() => setCreateModal(false)}
                />
                {loader ? (
                    <>
                        {cycleLayout === "list" && <CycleModuleListLayout />}
                        {cycleLayout === "board" && <CycleModuleBoardLayout />}
                        {cycleLayout === "gantt" && <GanttLayoutLoader />}
                    </>
                ) : totalCycles === 0 ? (
                    <div className="h-full place-items-center">
                        <EmptyState
                            title={CYCLE_EMPTY_STATE_DETAILS["cycles"].title}
                            description={CYCLE_EMPTY_STATE_DETAILS["cycles"].description}
                            image={EmptyStateImagePath}
                            comicBox={{
                                title: CYCLE_EMPTY_STATE_DETAILS["cycles"].comicBox.title,
                                description: CYCLE_EMPTY_STATE_DETAILS["cycles"].comicBox.description,
                            }}
                            primaryButton={{
                                text: CYCLE_EMPTY_STATE_DETAILS["cycles"].primaryButton.text,
                                onClick: () => {
                                    setTrackElement("Cycle empty state")
                                    setCreateModal(true)
                                },
                            }}
                            size="lg"
                            disabled={!isEditingAllowed}
                        />
                    </div>
                ) : (
                    <Tab.Group
                        as="div"
                        className="flex h-full flex-col overflow-hidden"
                        defaultIndex={CYCLE_TABS_LIST.findIndex((i) => i.key == cycleTab)}
                        selectedIndex={CYCLE_TABS_LIST.findIndex((i) => i.key == cycleTab)}
                        onChange={(i) => {
                            if (!projectId) return
                            const tab = CYCLE_TABS_LIST[i]
                            if (!tab) return
                            updateDisplayFilters(projectId.toString(), {
                                active_tab: tab.key,
                            })
                        }}
                    >
                        <CyclesViewHeader projectId={projectId.toString()} />
                        {calculateTotalFilters(currentProjectFilters ?? {}) !== 0 && (
                            <div className="border-b border-custom-border-200 px-5 py-3">
                                <CycleAppliedFiltersList
                                    appliedFilters={currentProjectFilters ?? {}}
                                    handleClearAllFilters={() => clearAllFilters(projectId.toString())}
                                    handleRemoveFilter={handleRemoveFilter}
                                />
                            </div>
                        )}
                        <Tab.Panels as={Fragment}>
                            <Tab.Panel as="div" className="h-full space-y-5 overflow-y-auto p-4 sm:p-5">
                                <ActiveCycleRoot
                                    workspaceSlug={workspaceSlug.toString()}
                                    projectId={projectId.toString()}
                                />
                            </Tab.Panel>
                            <Tab.Panel as="div" className="h-full overflow-y-auto">
                                {cycleTab && cycleLayout && (
                                    <CyclesView
                                        layout={cycleLayout}
                                        workspaceSlug={workspaceSlug.toString()}
                                        projectId={projectId.toString()}
                                        peekCycle={searchParams.get("peekCycle") as string}
                                    />
                                )}
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                )}
            </div>
        </AppWrapper>
    )
})

export default ProjectCyclesPage

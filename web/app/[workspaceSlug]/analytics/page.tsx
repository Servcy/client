"use client"

import { useRouter } from "next/router"

import { Fragment } from "react"

import { NextPageWithWrapper } from "@/types/index"
import { Tab } from "@headlessui/react"
import { observer } from "mobx-react-lite"
import { useTheme } from "next-themes"

import { CustomAnalytics, ScopeAndDemand } from "@components/analytics"
import { PageHead } from "@components/core"
import { EmptyState, getEmptyStateImagePath } from "@components/empty-state"
import { WorkspaceAnalyticsHeader } from "@components/headers"

import { useApplication, useEventTracker, useProject, useUser, useWorkspace } from "@hooks/store"

import { AppWrapper } from "@wrappers/app"

import { ANALYTICS_TABS } from "@constants/analytics"
import { WORKSPACE_EMPTY_STATE_DETAILS } from "@constants/empty-state"
import { EUserWorkspaceRoles } from "@constants/workspace"

const AnalyticsPage: NextPageWithWrapper = observer(() => {
    const router = useRouter()
    const { analytics_tab } = router.query
    // theme
    const { resolvedTheme } = useTheme()
    // store hooks
    const {
        commandPalette: { toggleCreateProjectModal },
    } = useApplication()
    const { setTrackElement } = useEventTracker()
    const {
        membership: { currentWorkspaceRole },
        currentUser,
    } = useUser()
    const { workspaceProjectIds } = useProject()
    const { currentWorkspace } = useWorkspace()
    // derived values
    const isLightMode = resolvedTheme ? resolvedTheme === "light" : currentUser?.theme.theme === "light"
    const EmptyStateImagePath = getEmptyStateImagePath("onboarding", "analytics", isLightMode)
    const isEditingAllowed = !!currentWorkspaceRole && currentWorkspaceRole >= EUserWorkspaceRoles.MEMBER
    const pageTitle = currentWorkspace?.name ? `${currentWorkspace?.name} - Analytics` : undefined

    return (
        <AppWrapper header={<WorkspaceAnalyticsHeader />}>
            <PageHead title={pageTitle} />
            {workspaceProjectIds && workspaceProjectIds.length > 0 ? (
                <div className="flex h-full flex-col overflow-hidden bg-custom-background-100">
                    <Tab.Group as={Fragment} defaultIndex={analytics_tab === "custom" ? 1 : 0}>
                        <Tab.List
                            as="div"
                            className="flex space-x-2 border-b border-custom-border-200 px-0 md:px-5 py-0 md:py-3"
                        >
                            {ANALYTICS_TABS.map((tab) => (
                                <Tab
                                    key={tab.key}
                                    className={({ selected }) =>
                                        `rounded-0 w-full md:w-max md:rounded-3xl border-b md:border border-custom-border-200 focus:outline-none px-0 md:px-4 py-2 text-xs hover:bg-custom-background-80 ${
                                            selected
                                                ? "border-custom-primary-100 text-custom-primary-100 md:bg-custom-background-80 md:text-custom-text-200 md:border-custom-border-200"
                                                : "border-transparent"
                                        }`
                                    }
                                    onClick={() => {
                                        router.query["analytics_tab"] = tab.key
                                        router.push(router)
                                    }}
                                >
                                    {tab.title}
                                </Tab>
                            ))}
                        </Tab.List>
                        <Tab.Panels as={Fragment}>
                            <Tab.Panel as={Fragment}>
                                <ScopeAndDemand fullScreen />
                            </Tab.Panel>
                            <Tab.Panel as={Fragment}>
                                <CustomAnalytics fullScreen />
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </div>
            ) : (
                <EmptyState
                    image={EmptyStateImagePath}
                    title={WORKSPACE_EMPTY_STATE_DETAILS["analytics"].title}
                    description={WORKSPACE_EMPTY_STATE_DETAILS["analytics"].description}
                    primaryButton={{
                        text: WORKSPACE_EMPTY_STATE_DETAILS["analytics"].primaryButton.text,
                        onClick: () => {
                            setTrackElement("Analytics empty state")
                            toggleCreateProjectModal(true)
                        },
                    }}
                    comicBox={{
                        title: WORKSPACE_EMPTY_STATE_DETAILS["analytics"].comicBox.title,
                        description: WORKSPACE_EMPTY_STATE_DETAILS["analytics"].comicBox.description,
                    }}
                    size="lg"
                    disabled={!isEditingAllowed}
                />
            )}
        </AppWrapper>
    )
})

AnalyticsPage.hasWrapper = true

export default AnalyticsPage

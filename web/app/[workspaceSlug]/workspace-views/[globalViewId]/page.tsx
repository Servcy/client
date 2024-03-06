"use client"

import { useRouter } from "next/router"

import { NextPageWithWrapper } from "@/types/index"
import { observer } from "mobx-react"

import { PageHead } from "@components/core"
import { GlobalIssuesHeader } from "@components/headers"
import { AllIssueLayoutRoot } from "@components/issues"
import { GlobalViewsHeader } from "@components/workspace"

import { useGlobalView, useWorkspace } from "@hooks/store"

import { DEFAULT_GLOBAL_VIEWS_LIST } from "@constants/workspace"

import { AppWrapper } from "@wrappers/app"

const GlobalViewIssuesPage: NextPageWithWrapper = observer(() => {
    // router
    const router = useRouter()
    const { globalViewId } = router.query
    // store hooks
    const { currentWorkspace } = useWorkspace()
    const { getViewDetailsById } = useGlobalView()
    // derived values
    const globalViewDetails = globalViewId ? getViewDetailsById(globalViewId.toString()) : undefined
    const defaultView = DEFAULT_GLOBAL_VIEWS_LIST.find((view) => view.key === globalViewId)
    const pageTitle =
        currentWorkspace?.name && defaultView?.label
            ? `${currentWorkspace?.name} - ${defaultView?.label}`
            : currentWorkspace?.name && globalViewDetails?.name
              ? `${currentWorkspace?.name} - ${globalViewDetails?.name}`
              : undefined

    return (
        <AppWrapper header={<GlobalIssuesHeader activeLayout="spreadsheet" />}>
            <PageHead title={pageTitle} />
            <div className="h-full overflow-hidden bg-custom-background-100">
                <div className="flex h-full w-full flex-col border-b border-custom-border-300">
                    <GlobalViewsHeader />
                    <AllIssueLayoutRoot />
                </div>
            </div>
        </AppWrapper>
    )
})

GlobalViewIssuesPage.hasWrapper = true

export default GlobalViewIssuesPage

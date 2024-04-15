"use client"

import { useParams } from "next/navigation"

import { observer } from "mobx-react-lite"
import useSWR from "swr"

import { PageHead } from "@components/core"
import { WorkspaceSettingHeader } from "@components/headers"

import { useUser, useWorkspace } from "@hooks/store"

import { ERoles } from "@constants/iam"

import { AppWrapper } from "@wrappers/app"
import { WorkspaceSettingWrapper } from "@wrappers/settings"

import { Button } from "@servcy/ui"

const BillingSettingsPage = observer(() => {
    // store hooks
    const {
        membership: { currentWorkspaceRole, fetchUserWorkspaceInfo },
    } = useUser()

    const { currentWorkspace } = useWorkspace()
    const { workspaceSlug } = useParams()
    // derived values
    const isAdmin = currentWorkspaceRole !== undefined && currentWorkspaceRole >= ERoles.ADMIN
    const pageTitle = currentWorkspace?.name ? `${currentWorkspace.name} - Billing & Plans` : undefined

    // fetching user workspace information
    useSWR(
        workspaceSlug ? `WORKSPACE_MEMBERS_ME_${workspaceSlug}` : null,
        workspaceSlug ? () => fetchUserWorkspaceInfo(workspaceSlug.toString()) : null,
        { revalidateIfStale: false }
    )

    if (!isAdmin)
        return (
            <>
                <PageHead title={pageTitle} />
                <div className="mt-10 flex h-screen w-full justify-center p-4">
                    <p className="text-sm text-custom-text-300">You are not authorized to access this page.</p>
                </div>
            </>
        )

    return (
        <AppWrapper header={<WorkspaceSettingHeader title="Billing & Plans Settings" />}>
            <WorkspaceSettingWrapper>
                <PageHead title={pageTitle} />
                <section className="w-full overflow-y-auto py-8 pr-9">
                    <div>
                        <div className="flex  items-center border-b border-custom-border-100 py-3.5">
                            <h3 className="text-xl font-medium">Billing & Plans</h3>
                        </div>
                    </div>
                    <div className="px-4 py-6">
                        <div>
                            <h4 className="text-md mb-1 leading-6">Current plan</h4>
                            <p className="mb-3 text-sm text-custom-text-200">You are currently on a free trial.</p>
                            <a href="https://servcy.com/pricing" target="_blank" rel="noreferrer">
                                <Button variant="neutral-primary">View Plans</Button>
                            </a>
                        </div>
                    </div>
                </section>
            </WorkspaceSettingWrapper>
        </AppWrapper>
    )
})

export default BillingSettingsPage

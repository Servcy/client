"use client"

import { ReactElement } from "react"

import { NextPageWithLayout } from "@/types/index"

import { ProjectSettingHeader } from "@components/headers"
import { ProjectSettingStateList } from "@components/states"

// layout
import { AppLayout } from "@layouts/app-layout"

import { ProjectSettingLayout } from "@wrappers/settings"

const StatesSettingsPage: NextPageWithLayout = () => (
    <div className="w-full gap-10 overflow-y-auto py-8 pr-9">
        <div className="flex items-center border-b border-custom-border-100 py-3.5">
            <h3 className="text-xl font-medium">States</h3>
        </div>
        <ProjectSettingStateList />
    </div>
)

StatesSettingsPage.getWrapper = function getWrapper(page: ReactElement) {
    return (
        <AppLayout withProjectWrapper header={<ProjectSettingHeader title="States Settings" />}>
            <ProjectSettingLayout>{page}</ProjectSettingLayout>
        </AppLayout>
    )
}

export default StatesSettingsPage

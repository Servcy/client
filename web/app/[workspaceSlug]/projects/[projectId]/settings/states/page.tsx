"use client"

import { NextPageWithWrapper } from "@/types/index"

import { ProjectSettingHeader } from "@components/headers"
import { ProjectSettingStateList } from "@components/states"

// layout
import { AppLayout } from "@layouts/app-layout"

import { ProjectSettingLayout } from "@wrappers/settings"

const StatesSettingsPage: NextPageWithWrapper = () => (
    <AppLayout withProjectWrapper header={<ProjectSettingHeader title="States Settings" />}>
        <ProjectSettingLayout>
            <div className="w-full gap-10 overflow-y-auto py-8 pr-9">
                <div className="flex items-center border-b border-custom-border-100 py-3.5">
                    <h3 className="text-xl font-medium">States</h3>
                </div>
                <ProjectSettingStateList />
            </div>
        </ProjectSettingLayout>
    </AppLayout>
)

StatesSettingsPage.hasWrapper = true

export default StatesSettingsPage

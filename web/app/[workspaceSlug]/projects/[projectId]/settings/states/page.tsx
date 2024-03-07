"use client"

import { ProjectSettingHeader } from "@components/headers"
import { ProjectSettingStateList } from "@components/states"

// layout
import { AppWrapper } from "@wrappers/app"
import { ProjectSettingLayout } from "@wrappers/settings"

import type { NextPageWithWrapper } from "@servcy/types"

const StatesSettingsPage: NextPageWithWrapper = () => (
    <AppWrapper withProjectWrapper header={<ProjectSettingHeader title="States Settings" />}>
        <ProjectSettingLayout>
            <div className="w-full gap-10 overflow-y-auto py-8 pr-9">
                <div className="flex items-center border-b border-custom-border-100 py-3.5">
                    <h3 className="text-xl font-medium">States</h3>
                </div>
                <ProjectSettingStateList />
            </div>
        </ProjectSettingLayout>
    </AppWrapper>
)

StatesSettingsPage.hasWrapper = true

export default StatesSettingsPage

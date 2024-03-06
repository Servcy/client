"use client"

import { NextPageWithWrapper } from "@/types/index"
import useSWR from "swr"

import { PageHead } from "@components/core"
import { EmailNotificationForm } from "@components/profile/preferences"
import { EmailSettingsLoader } from "@components/ui"

import { UserService } from "@services/user.service"

import { ProfilePreferenceSettingsLayout } from "@wrappers/settings/profile/preferences"

const userService = new UserService()

const ProfilePreferencesEmailPage: NextPageWithWrapper = () => {
    // fetching user email notification settings
    const { data, isLoading } = useSWR("CURRENT_USER_EMAIL_NOTIFICATION_SETTINGS", () =>
        userService.currentUserEmailNotificationSettings()
    )

    if (!data || isLoading) {
        return <EmailSettingsLoader />
    }

    return (
        <ProfilePreferenceSettingsLayout>
            <PageHead title="Profile - Email Preference" />
            <div className="mx-auto mt-8 h-full w-full overflow-y-auto px-6 lg:px-20 pb-8">
                <EmailNotificationForm data={data} />
            </div>
        </ProfilePreferenceSettingsLayout>
    )
}

ProfilePreferencesEmailPage.hasWrapper = true

export default ProfilePreferencesEmailPage

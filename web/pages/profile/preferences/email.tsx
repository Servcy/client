import { ReactElement } from "react"

// type
import { NextPageWithLayout } from "@/types/index"
import useSWR from "swr"

import { PageHead } from "@components/core"
import { EmailNotificationForm } from "@components/profile/preferences"
import { EmailSettingsLoader } from "@components/ui"

import { ProfilePreferenceSettingsLayout } from "@layouts/settings-layout/profile/preferences"

import { UserService } from "@services/user.service"

const userService = new UserService()

const ProfilePreferencesThemePage: NextPageWithLayout = () => {
    // fetching user email notification settings
    const { data, isLoading } = useSWR("CURRENT_USER_EMAIL_NOTIFICATION_SETTINGS", () =>
        userService.currentUserEmailNotificationSettings()
    )

    if (!data || isLoading) {
        return <EmailSettingsLoader />
    }

    return (
        <>
            <PageHead title="Profile - Email Preference" />
            <div className="mx-auto mt-8 h-full w-full overflow-y-auto px-6 lg:px-20 pb-8">
                <EmailNotificationForm data={data} />
            </div>
        </>
    )
}

ProfilePreferencesThemePage.getWrapper = function getWrapper(page: ReactElement) {
    return <ProfilePreferenceSettingsLayout>{page}</ProfilePreferenceSettingsLayout>
}

export default ProfilePreferencesThemePage

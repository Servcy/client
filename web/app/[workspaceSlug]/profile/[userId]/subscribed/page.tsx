"use client"

import { NextPageWithWrapper } from "@/types/index"
import { observer } from "mobx-react-lite"

import { PageHead } from "@components/core"
import { UserProfileHeader } from "@components/headers"
import { ProfileIssuesPage } from "@components/profile/profile-issues"

import { AppWrapper } from "@wrappers/app"
import ProfileAuthWrapper from "@wrappers/ProfileAuthWrapper"

const ProfileSubscribedIssuesPage: NextPageWithWrapper = () => (
    <AppWrapper header={<UserProfileHeader type="Subscribed" />}>
        <ProfileAuthWrapper showProfileIssuesFilter>
            <PageHead title="Profile - Subscribed" />
            <ProfileIssuesPage type="subscribed" />
        </ProfileAuthWrapper>
    </AppWrapper>
)

ProfileSubscribedIssuesPage.hasWrapper = true

export default observer(ProfileSubscribedIssuesPage)

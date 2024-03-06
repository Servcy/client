"use client"

import { NextPageWithWrapper } from "@/types/index"
import { observer } from "mobx-react-lite"

import { PageHead } from "@components/core"
import { UserProfileHeader } from "@components/headers"
import { ProfileIssuesPage } from "@components/profile/profile-issues"

import { AppLayout } from "@layouts/app-layout"
import { ProfileAuthWrapper } from "@layouts/user-profile-layout"

const ProfileSubscribedIssuesPage: NextPageWithWrapper = () => (
    <AppLayout header={<UserProfileHeader type="Subscribed" />}>
        <ProfileAuthWrapper showProfileIssuesFilter>
            <PageHead title="Profile - Subscribed" />
            <ProfileIssuesPage type="subscribed" />
        </ProfileAuthWrapper>
    </AppLayout>
)

ProfileSubscribedIssuesPage.hasWrapper = true

export default observer(ProfileSubscribedIssuesPage)

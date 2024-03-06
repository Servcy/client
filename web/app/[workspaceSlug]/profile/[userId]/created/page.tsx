"use client"

import { NextPageWithWrapper } from "@/types/index"
import { observer } from "mobx-react-lite"

import { PageHead } from "@components/core"
import { UserProfileHeader } from "@components/headers"
import { ProfileIssuesPage } from "@components/profile/profile-issues"

import { AppLayout } from "@layouts/app-layout"
import { ProfileAuthWrapper } from "@layouts/user-profile-layout"

const ProfileCreatedIssuesPage: NextPageWithWrapper = () => (
    <AppLayout header={<UserProfileHeader type="Created" />}>
        <ProfileAuthWrapper showProfileIssuesFilter>
            <PageHead title="Profile - Created" />
            <ProfileIssuesPage type="created" />
        </ProfileAuthWrapper>
    </AppLayout>
)

export default observer(ProfileCreatedIssuesPage)

"use client"

import { observer } from "mobx-react-lite"

import { PageHead } from "@components/core"
import { UserProfileHeader } from "@components/headers"
import { ProfileIssuesPage } from "@components/profile/profile-issues"

import { AppWrapper } from "@wrappers/app"
import ProfileAuthWrapper from "@wrappers/ProfileAuthWrapper"

import type { NextPageWithWrapper } from "@servcy/types"

const ProfileCreatedIssuesPage: NextPageWithWrapper = () => (
    <AppWrapper header={<UserProfileHeader type="Created" />}>
        <ProfileAuthWrapper showProfileIssuesFilter>
            <PageHead title="Profile - Created" />
            <ProfileIssuesPage type="created" />
        </ProfileAuthWrapper>
    </AppWrapper>
)

export default observer(ProfileCreatedIssuesPage)

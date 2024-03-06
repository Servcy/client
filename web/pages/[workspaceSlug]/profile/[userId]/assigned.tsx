import React, { ReactElement } from "react"

import { PageHead } from "@components/core"
import { UserProfileHeader } from "@components/headers"
import { ProfileIssuesPage } from "@components/profile/profile-issues"

import { AppLayout } from "@layouts/app-layout"
import { ProfileAuthWrapper } from "@layouts/user-profile-layout"

import { NextPageWithLayout } from "@/types/types"

const ProfileAssignedIssuesPage: NextPageWithLayout = () => (
    <>
        <PageHead title="Profile - Assigned" />
        <ProfileIssuesPage type="assigned" />
    </>
)

ProfileAssignedIssuesPage.getWrapper = function getWrapper(page: ReactElement) {
    return (
        <AppLayout header={<UserProfileHeader type="Assigned" />}>
            <ProfileAuthWrapper showProfileIssuesFilter>{page}</ProfileAuthWrapper>
        </AppLayout>
    )
}

export default ProfileAssignedIssuesPage

"use client"

import { ReactElement } from "react"

import { NextPageWithLayout } from "@/types/index"
// store
import { observer } from "mobx-react-lite"

import { PageHead } from "@components/core"
import { UserProfileHeader } from "@components/headers"
import { ProfileIssuesPage } from "@components/profile/profile-issues"

import { AppLayout } from "@layouts/app-layout"
import { ProfileAuthWrapper } from "@layouts/user-profile-layout"

const ProfileSubscribedIssuesPage: NextPageWithLayout = () => (
    <>
        <PageHead title="Profile - Subscribed" />
        <ProfileIssuesPage type="subscribed" />
    </>
)

ProfileSubscribedIssuesPage.getWrapper = function getWrapper(page: ReactElement) {
    return (
        <AppLayout header={<UserProfileHeader type="Subscribed" />}>
            <ProfileAuthWrapper showProfileIssuesFilter>{page}</ProfileAuthWrapper>
        </AppLayout>
    )
}

export default observer(ProfileSubscribedIssuesPage)

"use client"

import React from "react"

import { NextPageWithWrapper } from "@/types/index"

import { PageHead } from "@components/core"
import { UserProfileHeader } from "@components/headers"
import { ProfileIssuesPage } from "@components/profile/profile-issues"

import { AppLayout } from "@layouts/app-layout"
import { ProfileAuthWrapper } from "@layouts/user-profile-layout"

const ProfileAssignedIssuesPage: NextPageWithWrapper = () => (
    <AppLayout header={<UserProfileHeader type="Assigned" />}>
        <ProfileAuthWrapper showProfileIssuesFilter>
            <PageHead title="Profile - Assigned" />
            <ProfileIssuesPage type="assigned" />
        </ProfileAuthWrapper>
    </AppLayout>
)

ProfileAssignedIssuesPage.hasWrapper = true

export default ProfileAssignedIssuesPage

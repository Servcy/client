"use client"

import React from "react"

import { PageHead } from "@components/core"
import { UserProfileHeader } from "@components/headers"
import { ProfileIssuesPage } from "@components/profile/profile-issues"

import { AppWrapper } from "@wrappers/app"
import ProfileAuthWrapper from "@wrappers/ProfileAuthWrapper"

const ProfileAssignedIssuesPage = () => (
    <AppWrapper header={<UserProfileHeader type="Assigned" />}>
        <ProfileAuthWrapper showProfileIssuesFilter>
            <PageHead title="Profile - Assigned" />
            <ProfileIssuesPage type="assigned" />
        </ProfileAuthWrapper>
    </AppWrapper>
)

export default ProfileAssignedIssuesPage

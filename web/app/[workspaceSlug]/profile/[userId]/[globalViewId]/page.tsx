"use client"

import { useParams } from "next/navigation"

import React from "react"

import { PageHead } from "@components/core"
import { UserProfileHeader } from "@components/headers"
import { ProfileIssuesPage } from "@components/profile/profile-issues"

import { AppWrapper } from "@wrappers/app"
import ProfileAuthWrapper from "@wrappers/auth/ProfileAuthWrapper"

import { capitalizeFirstLetter } from "@helpers/string.helper"

const ProfileIssuesView = () => {
    const { globalViewId } = useParams() as {
        workspaceSlug: string
        userId: string
        globalViewId: "assigned" | "created" | "subscribed"
    }
    return (
        <AppWrapper header={<UserProfileHeader type={capitalizeFirstLetter(globalViewId)} />}>
            <ProfileAuthWrapper showProfileIssuesFilter>
                <PageHead title={`"Profile - ${capitalizeFirstLetter(globalViewId)}"`} />
                <ProfileIssuesPage type={globalViewId} />
            </ProfileAuthWrapper>
        </AppWrapper>
    )
}

export default ProfileIssuesView

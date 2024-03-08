"use client"

import { useRouter } from "next/router"

import useSWR from "swr"

import { PageHead } from "@components/core"
import { UserProfileHeader } from "@components/headers"
import {
    ProfileActivity,
    ProfilePriorityDistribution,
    ProfileStateDistribution,
    ProfileStats,
    ProfileWorkload,
} from "@components/profile"

import { USER_PROFILE_DATA } from "@constants/fetch-keys"
import { GROUP_CHOICES } from "@constants/project"

import { UserService } from "@services/user.service"

import { AppWrapper } from "@wrappers/app"
import ProfileAuthWrapper from "@wrappers/ProfileAuthWrapper"

import type { IUserStateDistribution, NextPageWithWrapper, TStateGroups } from "@servcy/types"

const userService = new UserService()

const ProfileOverviewPage: NextPageWithWrapper = () => {
    const router = useRouter()
    const { workspaceSlug, userId } = router.query

    const { data: userProfile } = useSWR(
        workspaceSlug && userId ? USER_PROFILE_DATA(workspaceSlug.toString(), userId.toString()) : null,
        workspaceSlug && userId
            ? () => userService.getUserProfileData(workspaceSlug.toString(), userId.toString())
            : null
    )

    const stateDistribution: IUserStateDistribution[] = Object.keys(GROUP_CHOICES).map((key) => {
        const group = userProfile?.state_distribution.find((g) => g.state_group === key)

        if (group) return group
        else return { state_group: key as TStateGroups, state_count: 0 }
    })

    return (
        <AppWrapper header={<UserProfileHeader type="Summary" />}>
            <ProfileAuthWrapper>
                <PageHead title="Profile - Summary" />
                <div className="h-full w-full space-y-7 overflow-y-auto px-5 py-5 md:px-9">
                    <ProfileStats userProfile={userProfile} />
                    <ProfileWorkload stateDistribution={stateDistribution} />
                    <div className="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-2">
                        <ProfilePriorityDistribution userProfile={userProfile} />
                        <ProfileStateDistribution stateDistribution={stateDistribution} userProfile={userProfile} />
                    </div>
                    <ProfileActivity />
                </div>
            </ProfileAuthWrapper>
        </AppWrapper>
    )
}

ProfileOverviewPage.hasWrapper = true

export default ProfileOverviewPage

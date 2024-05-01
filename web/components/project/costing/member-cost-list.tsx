import { useState } from "react"

import { Search } from "lucide-react"
import { observer } from "mobx-react-lite"

import { MembersSettingsLoader } from "@components/ui"

import { useMember } from "@hooks/store"

import { IMemberWiseCalculatedCost } from "@servcy/types"

import { MemberCostRow } from "./member-cost-row"

export const MemberCostList: React.FC<{
    memberWiseCalculatedMap: Record<string, IMemberWiseCalculatedCost>
}> = observer(({ memberWiseCalculatedMap }) => {
    const [searchQuery, setSearchQuery] = useState("")
    const {
        project: { projectMemberIds, getProjectMemberDetails },
    } = useMember()
    const searchedMembers = (projectMemberIds ?? []).filter((userId) => {
        const memberDetails = getProjectMemberDetails(userId)

        if (!memberDetails?.member) return false

        const fullName = `${memberDetails?.member.first_name} ${memberDetails?.member.last_name}`.toLowerCase()
        const displayName = memberDetails?.member.display_name.toLowerCase()

        return displayName?.includes(searchQuery.toLowerCase()) || fullName.includes(searchQuery.toLowerCase())
    })

    return (
        <>
            <div className="flex items-center justify-between gap-4 border-b px-3 border-custom-border-100 py-3.5">
                <h4 className="text-xl font-medium">Members Cost</h4>
                <div className="ml-auto flex items-center justify-start gap-1 rounded-md border border-custom-border-200 bg-custom-background-100 px-2.5 py-1.5 text-custom-text-400">
                    <Search className="h-3.5 w-3.5" />
                    <input
                        className="w-full max-w-[234px] border-none bg-transparent text-sm focus:outline-none"
                        placeholder="Search"
                        value={searchQuery}
                        autoFocus
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            {!projectMemberIds ? (
                <MembersSettingsLoader />
            ) : (
                <div className="divide-y divide-custom-border-100 horizontal-scrollbar scrollbar-sm">
                    {projectMemberIds.length > 0
                        ? searchedMembers.map((userId) => (
                              <MemberCostRow
                                  key={userId}
                                  userId={userId}
                                  totalLoggedSeconds={memberWiseCalculatedMap?.[userId]?.sum ?? 0}
                              />
                          ))
                        : null}
                    {searchedMembers.length === 0 && (
                        <h4 className="text-sm mt-16 text-center text-custom-text-400">No matching members</h4>
                    )}
                </div>
            )}
        </>
    )
})

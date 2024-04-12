import { observer } from "mobx-react"

import { UpcomingCycleListItem } from "@components/cycles"

import { useCycle } from "@hooks/store"

export const UpcomingCyclesList = observer(() => {
    const { currentProjectUpcomingCycleIds } = useCycle()
    if (!currentProjectUpcomingCycleIds) return null
    return (
        <div>
            <div className="bg-custom-background-80 font-semibold text-sm py-1 px-2 rounded inline-block">
                Upcoming cycles
            </div>
            <div className="mt-2 divide-y-[0.5px] divide-custom-border-200 border-b-[0.5px] border-custom-border-200">
                {currentProjectUpcomingCycleIds.map((cycleId) => (
                    <UpcomingCycleListItem key={cycleId} cycleId={cycleId} />
                ))}
            </div>
        </div>
    )
})

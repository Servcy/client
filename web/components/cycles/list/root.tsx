import { FC } from "react"

import { Disclosure } from "@headlessui/react"
import { ChevronRight } from "lucide-react"
import { observer } from "mobx-react-lite"

// components
import { CyclePeekOverview, CyclesListMap } from "@components/cycles"

// helpers
import { cn } from "@helpers/common.helper"

export interface ICyclesList {
    completedCycleIds: string[]
    cycleIds: string[]
    isArchived?: boolean
    workspaceSlug: string
    projectId: string
}

export const CyclesList: FC<ICyclesList> = observer((props) => {
    const { completedCycleIds, cycleIds, isArchived, workspaceSlug, projectId } = props

    return (
        <div className="h-full overflow-y-auto">
            <div className="flex h-full w-full justify-between">
                <div className="flex h-full w-full flex-col overflow-y-auto vertical-scrollbar scrollbar-lg">
                    <CyclesListMap
                        cycleIds={cycleIds}
                        projectId={projectId}
                        workspaceSlug={workspaceSlug}
                        isArchived={isArchived}
                    />
                    {completedCycleIds.length !== 0 && (
                        <Disclosure as="div" className="pt-8 pl-3 space-y-4">
                            <Disclosure.Button className="bg-custom-background-80 font-semibold text-sm py-1 px-2 rounded ml-5 flex items-center gap-1">
                                {({ open }) => (
                                    <>
                                        Completed cycles ({completedCycleIds.length})
                                        <ChevronRight
                                            className={cn("h-3 w-3 transition-all", {
                                                "rotate-90": open,
                                            })}
                                        />
                                    </>
                                )}
                            </Disclosure.Button>
                            <Disclosure.Panel>
                                <CyclesListMap
                                    cycleIds={completedCycleIds}
                                    projectId={projectId}
                                    workspaceSlug={workspaceSlug}
                                    isArchived={isArchived}
                                />
                            </Disclosure.Panel>
                        </Disclosure>
                    )}
                </div>
                <CyclePeekOverview projectId={projectId} workspaceSlug={workspaceSlug} isArchived={isArchived} />
            </div>
        </div>
    )
})

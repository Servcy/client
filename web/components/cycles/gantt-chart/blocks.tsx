import { useRouter } from "next/navigation"

import { observer } from "mobx-react"

import { useApplication, useCycle } from "@hooks/store"

import { renderFormattedDate } from "@helpers/date-time.helper"

import { ContrastIcon, Tooltip } from "@servcy/ui"

type Props = {
    cycleId: string
}

export const CycleGanttBlock: React.FC<Props> = observer((props) => {
    const { cycleId } = props
    // router
    const router = useRouter()
    // store hooks
    const {
        router: { workspaceSlug },
    } = useApplication()
    const { getCycleById } = useCycle()
    // derived values
    const cycleDetails = getCycleById(cycleId)

    const cycleStatus = cycleDetails?.status.toLocaleLowerCase()

    return (
        <div
            className="relative flex h-full w-full items-center rounded"
            style={{
                backgroundColor:
                    cycleStatus === "current"
                        ? "#3f76ff"
                        : cycleStatus === "upcoming"
                          ? "#f7ae59"
                          : cycleStatus === "completed"
                            ? "#4D7E3E"
                            : cycleStatus === "draft"
                              ? "rgb(var(--color-text-200))"
                              : "",
            }}
            onClick={() =>
                router.push(`/${workspaceSlug}/projects/${cycleDetails?.project_id}/cycles/${cycleDetails?.id}`)
            }
        >
            <div className="absolute left-0 top-0 h-full w-full bg-custom-background-100/50" />
            <Tooltip
                tooltipContent={
                    <div className="space-y-1">
                        <h5>{cycleDetails?.name}</h5>
                        <div>
                            {renderFormattedDate(cycleDetails?.start_date ?? "")} to{" "}
                            {renderFormattedDate(cycleDetails?.end_date ?? "")}
                        </div>
                    </div>
                }
                position="top-left"
            >
                <div className="relative w-full truncate px-2.5 py-1 text-sm text-custom-text-100">
                    {cycleDetails?.name}
                </div>
            </Tooltip>
        </div>
    )
})

export const CycleGanttSidebarBlock: React.FC<Props> = observer((props) => {
    const { cycleId } = props
    // router
    const router = useRouter()
    // store hooks
    const {
        router: { workspaceSlug },
    } = useApplication()
    const { getCycleById } = useCycle()
    // derived values
    const cycleDetails = getCycleById(cycleId)

    const cycleStatus = cycleDetails?.status.toLocaleLowerCase()

    return (
        <div
            className="relative flex h-full w-full items-center gap-2"
            onClick={() =>
                router.push(`/${workspaceSlug}/projects/${cycleDetails?.project_id}/cycles/${cycleDetails?.id}`)
            }
        >
            <ContrastIcon
                className="h-5 w-5 flex-shrink-0"
                color={`${
                    cycleStatus === "current"
                        ? "#3f76ff"
                        : cycleStatus === "upcoming"
                          ? "#f7ae59"
                          : cycleStatus === "completed"
                            ? "#4D7E3E"
                            : cycleStatus === "draft"
                              ? "rgb(var(--color-text-200))"
                              : ""
                }`}
            />
            <h6 className="flex-grow truncate text-sm font-medium">{cycleDetails?.name}</h6>
        </div>
    )
})

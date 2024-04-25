import { useParams } from "next/navigation"

import { FC, useRef, useState } from "react"

import toast from "react-hot-toast"

import { useTimeTracker, useUser } from "@hooks/store"
import useOutsideClickDetector from "@hooks/use-outside-click-detector"

import { ITrackedTime } from "@servcy/types"
import { Input, Tooltip } from "@servcy/ui"

export const DescriptionColumn: FC<{
    tableCellRef: React.RefObject<HTMLTableCellElement>
    timeLog: ITrackedTime
}> = ({ tableCellRef, timeLog }) => {
    const { workspaceSlug } = useParams()
    const inputRef = useRef<HTMLInputElement>(null)
    const [description, setDescription] = useState<string>(timeLog.description)
    const { updateTimeLog } = useTimeTracker()
    const { currentUser } = useUser()
    useOutsideClickDetector(inputRef, async () => {
        if (description === timeLog.description) return
        try {
            await updateTimeLog(workspaceSlug.toString(), timeLog.project, timeLog.id, { description })
        } catch {
            toast.error("Failed to update time log")
        }
    })
    return (
        <td
            tabIndex={0}
            className="h-11 border-b-[0.5px] border-custom-border-200 max-w-96 min-w-[12rem] bg-custom-background-100 text-sm after:absolute after:w-full after:bottom-[-1px] after:border after:border-custom-border-100 border-r-[1px]"
            ref={tableCellRef}
        >
            <div className="w-full overflow-hidden">
                <Tooltip tooltipHeading="Description" tooltipContent={timeLog.description}>
                    <div className="h-full w-full cursor-pointer truncate text-left text-custom-text-100 focus:outline-none">
                        <Input
                            id={`description-${timeLog.id}`}
                            name="description"
                            type="text"
                            value={description}
                            disabled={timeLog.created_by !== currentUser?.id || timeLog.is_approved}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter description..."
                            className="w-full border-none rounded-none"
                            inputSize="sm"
                            ref={inputRef}
                            tabIndex={0}
                        />
                    </div>
                </Tooltip>
            </div>
        </td>
    )
}

import { FC } from "react"

import { AlertTriangle, CircleDollarSign } from "lucide-react"
import toast from "react-hot-toast"

import { useTimeTracker, useUser } from "@hooks/store"

import { ITrackedTime } from "@servcy/types"
import { CustomSelect } from "@servcy/ui"

export const IsBillableColumn: FC<{
    tableCellRef: React.RefObject<HTMLTableCellElement>
    timeLog: ITrackedTime
}> = ({ tableCellRef, timeLog }) => {
    const { updateTimeLog } = useTimeTracker()
    const { currentUser } = useUser()
    return (
        <td
            tabIndex={0}
            className="h-11 w-full min-w-[8rem] bg-custom-background-100 text-sm after:absolute after:w-full after:bottom-[-1px] after:border after:border-custom-border-100 border-r-[1px] border-custom-border-100"
            ref={tableCellRef}
        >
            <div className="h-11 border-b-[0.5px] border-custom-border-200 flex items-center">
                <CustomSelect
                    customButton={
                        <div className="flex gap-x-2 py-2 px-4 items-center">
                            {timeLog.is_billable ? (
                                <CircleDollarSign className="size-4 text-custom-text-200" />
                            ) : (
                                <AlertTriangle className="size-4 text-custom-text-200" />
                            )}
                            <div>{timeLog.is_billable ? "Billable" : "Non-Billable"}</div>
                        </div>
                    }
                    value={timeLog.is_billable}
                    placement="bottom-start"
                    disabled={timeLog.created_by !== currentUser?.id || timeLog.is_approved}
                    customButtonClassName="w-full h-11"
                    onChange={async (value: boolean) => {
                        if (timeLog.is_billable === value) return
                        try {
                            await updateTimeLog(timeLog.workspace, timeLog.project, timeLog.id, { is_billable: value })
                        } catch {
                            toast.error("Failed to update time log")
                        }
                    }}
                    className="grow"
                >
                    <CustomSelect.Option value={true}>
                        <div className="flex items-center gap-2">
                            <CircleDollarSign className="size-4 text-custom-text-200" />
                            <div>Billable</div>
                        </div>
                    </CustomSelect.Option>
                    <CustomSelect.Option value={false}>
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="size-4 text-custom-text-200" />
                            <div>Non Billable</div>
                        </div>
                    </CustomSelect.Option>
                </CustomSelect>
            </div>
        </td>
    )
}

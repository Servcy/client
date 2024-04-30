import { useParams } from "next/navigation"

import { Dispatch, FC, SetStateAction, useState } from "react"

import { LocalizationProvider, MobileDateTimePicker } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { format } from "date-fns"
import { toast } from "react-hot-toast"

import { useTimeTracker, useUser } from "@hooks/store"

import { renderFormattedDateTime } from "@helpers/date-time.helper"

import { ITrackedTime } from "@servcy/types"

const CustomTextField: FC<{
    value: string
    setOpen?: Dispatch<SetStateAction<boolean>>
    disabled?: boolean
    id?: string
    ref?: React.Ref<HTMLInputElement>
}> = ({ value, setOpen, disabled, id, ref }) => (
    <div className="flex items-center justify-center w-full h-11 p-2">
        <input
            onClick={() => setOpen?.((prev: boolean) => !prev)}
            value={renderFormattedDateTime(value, "MMM dd HH:mm:ss")}
            disabled={disabled}
            id={id}
            ref={ref}
            className="w-full h-full text-sm p-2 text-custom-text-200 focus:outline-none focus:ring-0 bg-custom-background-80 rounded cursor-pointer"
        />
    </div>
)

export const EndTimePicker: FC<{
    tableCellRef: React.RefObject<HTMLTableCellElement>
    timeLog: ITrackedTime
}> = ({ tableCellRef, timeLog }) => {
    const { workspaceSlug } = useParams()
    const initialDateTime = new Date(timeLog.end_time)
    // min date time is the start time of the time log plus 5 minutes
    const minDateTime = new Date(timeLog.start_time)
    minDateTime.setMinutes(minDateTime.getMinutes() + 5)
    // max date time is the start time of the time log plus 24 hours
    const maxDateTime = new Date(timeLog.start_time)
    maxDateTime.setHours(maxDateTime.getHours() + 24)
    const { updateTimeLog } = useTimeTracker()
    const { currentUser } = useUser()
    const [open, setOpen] = useState(false)
    return (
        <td
            tabIndex={0}
            className="bg-custom-background-100 after:border-custom-border-100 border-custom-border-100 h-11 w-full min-w-[10rem] border-r-[1px] text-sm after:absolute after:bottom-[-1px] after:w-full after:border"
            ref={tableCellRef}
        >
            <div className="border-custom-border-200 h-11 border-b-[0.5px]">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <MobileDateTimePicker
                        defaultValue={initialDateTime}
                        readOnly={timeLog.created_by !== currentUser?.id || timeLog.is_approved}
                        ampm={false}
                        ampmInClock={false}
                        views={["month", "day", "hours", "minutes", "seconds"]}
                        onOpen={() => setOpen(true)}
                        open={open}
                        onClose={() => setOpen(false)}
                        showDaysOutsideCurrentMonth={true}
                        slotProps={{
                            toolbar: {
                                hidden: true,
                            },
                            tabs: {
                                hidden: true,
                            },
                            textField: {
                                setOpen: setOpen,
                                disabled: timeLog.created_by !== currentUser?.id || timeLog.is_approved,
                            } as any,
                            layout: {
                                sx: {
                                    backgroundColor: "rgba(var(--color-background-90))",
                                    color: "rgba(var(--color-text-100))",
                                    ".MuiButtonBase-root": {
                                        color: "rgba(var(--color-text-100)) !important",
                                    },
                                    ".MuiPickersDay-dayOutsideMonth": {
                                        color: "rgba(var(--color-text-200)) !important",
                                    },
                                    ".MuiPickersMonth-monthButton": {
                                        color: "rgba(var(--color-text-100)) !important",
                                    },
                                    ".Mui-selected": {
                                        backgroundColor: "rgba(var(--color-primary-100)) !important",
                                    },
                                    ".MuiButtonBase-root.MuiPickersDay-root:hover": {
                                        "&:hover": {
                                            backgroundColor: "rgba(var(--color-background-80)) !important",
                                        },
                                    },
                                    ".MuiClockPointer-root,.MuiClock-pin,.MuiClockPointer-thumb": {
                                        backgroundColor: "rgba(var(--color-primary-100)) !important",
                                    },
                                    ".MuiClockPointer-thumb": {
                                        borderColor: "rgba(var(--color-primary-100)) !important",
                                    },
                                    ".MuiTimeClock-root": {
                                        span: {
                                            color: "rgba(var(--color-text-100)) !important",
                                        },
                                        "span.Mui-disabled": {
                                            color: "rgba(var(--color-text-200)) !important",
                                        },
                                    },
                                },
                            },
                            calendarHeader: {
                                sx: {
                                    color: "rgba(var(--color-text-100))",
                                    ".MuiSvgIcon-root": {
                                        color: "rgba(var(--color-text-100))",
                                    },
                                },
                            },
                            actionBar: {
                                sx: {
                                    "& .MuiButton-root": {
                                        fontSize: "0.75rem",
                                        fontWeight: 400,
                                        textTransform: "capitalize",
                                        borderRadius: "0.75rem",
                                        padding: "0.3rem 0.7rem",
                                        border: "1px solid rgba(var(--color-border-200))",
                                        whiteSpace: "nowrap",
                                    },
                                    "& .MuiButton-root:first-child": {
                                        color: "rgba(var(--color-text-200))",
                                        backgroundColor: "rgba(var(--color-background-100))",
                                        "&:hover": {
                                            color: "rgba(var(--color-text-100))",
                                        },
                                    },
                                    "& .MuiButton-root:last-child": {
                                        color: "rgba(var(--color-text-100))",
                                        backgroundColor: "rgba(var(--color-primary-100))",
                                        "&:hover": {
                                            color: "white",
                                            backgroundColor: "rgba(var(--color-primary-200))",
                                        },
                                    },
                                },
                            },
                        }}
                        slots={{
                            textField: CustomTextField,
                        }}
                        minDateTime={minDateTime}
                        maxDateTime={maxDateTime}
                        onAccept={async (value) => {
                            if (value === null || value === initialDateTime) return
                            try {
                                await updateTimeLog(workspaceSlug.toString(), timeLog.project, timeLog.id, {
                                    end_time: format(value, "yyyy-MM-dd'T'HH:mm"),
                                })
                            } catch {
                                toast.error("Please try again later")
                            }
                        }}
                    />
                </LocalizationProvider>
            </div>
        </td>
    )
}

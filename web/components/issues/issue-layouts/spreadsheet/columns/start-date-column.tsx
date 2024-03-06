import React from "react"
import { DateDropdown } from "@components/dropdowns"
import { renderFormattedPayloadDate } from "@helpers/date-time.helper"
import { CalendarClock } from "lucide-react"
import { observer } from "mobx-react-lite"
import { TIssue } from "@servcy/types"

type Props = {
    issue: TIssue
    onClose: () => void
    onChange: (issue: TIssue, data: Partial<TIssue>, updates: any) => void
    disabled: boolean
}

export const SpreadsheetStartDateColumn: React.FC<Props> = observer((props: Props) => {
    const { issue, onChange, disabled, onClose } = props

    return (
        <div className="h-11 border-b-[0.5px] border-custom-border-200">
            <DateDropdown
                value={issue.start_date}
                maxDate={issue.target_date ? new Date(issue.target_date) : undefined}
                onChange={(data) => {
                    const startDate = data ? renderFormattedPayloadDate(data) : null
                    onChange(
                        issue,
                        { start_date: startDate },
                        {
                            changed_property: "start_date",
                            change_details: startDate,
                        }
                    )
                }}
                disabled={disabled}
                placeholder="Start date"
                icon={<CalendarClock className="h-3 w-3 flex-shrink-0" />}
                buttonVariant="transparent-with-text"
                buttonClassName="rounded-none text-left"
                buttonContainerClassName="w-full"
                onClose={onClose}
            />
        </div>
    )
})

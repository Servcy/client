import React, { Dispatch, SetStateAction, useState } from "react"

import { Pencil } from "lucide-react"

import { IIssueLabel } from "@servcy/types"

import { CreateUpdateLabelInline } from "./create-update-label-inline"
import { ICustomMenuItem, LabelItemBlock } from "./label-item-block"

type Props = {
    label: Partial<IIssueLabel>
    handleLabelDelete: (label: string) => void
    updateLabel: (label: Partial<IIssueLabel>) => void
    setIsUpdating: Dispatch<SetStateAction<boolean>>
    isChild: boolean
}

export const ProjectTemplateLabelItem: React.FC<Props> = (props) => {
    const { label, setIsUpdating, updateLabel, handleLabelDelete } = props
    // states
    const [isEditLabelForm, setEditLabelForm] = useState(false)

    const customMenuItems: ICustomMenuItem[] = [
        {
            CustomIcon: Pencil,
            onClick: () => {
                setEditLabelForm(true)
                setIsUpdating(true)
            },
            isVisible: true,
            text: "Edit label",
            key: "edit_label",
        },
    ]

    return (
        <div className="group relative flex items-center justify-between gap-2 space-y-3 rounded border-[0.5px] border-custom-border-200 bg-custom-background-100 px-1 py-2.5">
            {isEditLabelForm ? (
                <CreateUpdateLabelInline
                    labelForm={isEditLabelForm}
                    setLabelForm={setEditLabelForm}
                    isUpdating
                    labelToUpdate={label}
                    updateLabel={updateLabel}
                    onClose={() => {
                        setEditLabelForm(false)
                        setIsUpdating(false)
                    }}
                />
            ) : (
                <LabelItemBlock label={label} customMenuItems={customMenuItems} handleLabelDelete={handleLabelDelete} />
            )}
        </div>
    )
}

import { useRef, useState } from "react"

import { LucideIcon, X } from "lucide-react"

//hooks
import useOutsideClickDetector from "@hooks/use-outside-click-detector"

//types
import { IIssueLabel } from "@servcy/types"
//ui
import { CustomMenu } from "@servcy/ui"

import { LabelName } from "../label-block/label-name"

//types
export interface ICustomMenuItem {
    CustomIcon: LucideIcon
    onClick: () => void
    isVisible: boolean
    text: string
    key: string
}

interface ILabelItemBlock {
    label: Partial<IIssueLabel>
    customMenuItems: ICustomMenuItem[]
    handleLabelDelete: (label: string) => void
    isLabelGroup?: boolean
}

export const LabelItemBlock = (props: ILabelItemBlock) => {
    const { label, customMenuItems, handleLabelDelete, isLabelGroup } = props
    // states
    const [isMenuActive, setIsMenuActive] = useState(false)
    // refs
    const actionSectionRef = useRef<HTMLDivElement | null>(null)

    useOutsideClickDetector(actionSectionRef, () => setIsMenuActive(false))

    if (!label.name || !label.color) return null

    return (
        <div className="group flex items-center">
            <div className="flex items-center">
                <LabelName color={label.color} name={label.name} isGroup={isLabelGroup ?? false} />
            </div>

            <div
                ref={actionSectionRef}
                className={`absolute right-3 flex items-start gap-3.5 px-4 ${
                    isMenuActive || isLabelGroup
                        ? "opacity-100"
                        : "opacity-0 group-hover:pointer-events-auto group-hover:opacity-100"
                } ${isLabelGroup && "-top-0.5"}`}
            >
                <CustomMenu ellipsis buttonClassName="h-4 w-4 leading-4 text-custom-sidebar-text-400">
                    {customMenuItems.map(
                        ({ isVisible, onClick, CustomIcon, text, key }) =>
                            isVisible && (
                                <CustomMenu.MenuItem key={key} onClick={() => onClick()}>
                                    <span className="flex items-center justify-start gap-2">
                                        <CustomIcon className="h-4 w-4" />
                                        <span>{text}</span>
                                    </span>
                                </CustomMenu.MenuItem>
                            )
                    )}
                </CustomMenu>
                {!isLabelGroup && (
                    <div className="py-0.5">
                        <button
                            className="flex h-4 w-4 items-center justify-start gap-2"
                            onClick={() => handleLabelDelete(label.name ?? "")}
                        >
                            <X className="h-4 w-4  flex-shrink-0 text-custom-sidebar-text-400" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

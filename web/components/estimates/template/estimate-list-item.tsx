import React from "react"

import { Pencil } from "lucide-react"
import { observer } from "mobx-react-lite"

import { orderArrayBy } from "@helpers/array.helper"

import { IEstimate } from "@servcy/types"
import { CustomMenu } from "@servcy/ui"

type Props = {
    estimate: Partial<IEstimate>
    editEstimate: (estimate: Partial<IEstimate>) => void
}

export const EstimateListItem: React.FC<Props> = observer((props) => {
    const { estimate, editEstimate } = props
    return (
        <>
            <div className="gap-2 border-b border-custom-border-100 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h6 className="flex w-[40vw] items-center gap-2 truncate text-sm font-medium">
                            {estimate.name}
                        </h6>
                        <p className="font-sm w-[40vw] truncate text-[14px] font-normal text-custom-text-200">
                            {estimate.description}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <CustomMenu ellipsis>
                            <CustomMenu.MenuItem
                                onClick={() => {
                                    editEstimate(estimate)
                                }}
                            >
                                <div className="flex items-center justify-start gap-2">
                                    <Pencil className="h-3.5 w-3.5" />
                                    <span>Edit estimate</span>
                                </div>
                            </CustomMenu.MenuItem>
                        </CustomMenu>
                    </div>
                </div>
                {estimate?.points?.length > 0 ? (
                    <div className="flex text-xs text-custom-text-200">
                        Estimate points (
                        <span className="flex gap-1">
                            {orderArrayBy(estimate.points, "key").map((point, index) => (
                                <h6 key={point.id} className="text-custom-text-200">
                                    {point.value}
                                    {index !== estimate.points.length - 1 && ","}{" "}
                                </h6>
                            ))}
                        </span>
                        )
                    </div>
                ) : (
                    <div>
                        <p className="text-xs text-custom-text-200">No estimate points</p>
                    </div>
                )}
            </div>
        </>
    )
})

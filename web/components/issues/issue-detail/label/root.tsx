import { FC, useMemo } from "react"

import { observer } from "mobx-react-lite"
import toast from "react-hot-toast"

import { useIssueDetail, useLabel } from "@hooks/store"

import { IIssueLabel, TIssue } from "@servcy/types"

import { IssueLabelSelectRoot, LabelCreate, LabelList } from "./"

export type TIssueLabel = {
    workspaceSlug: string
    projectId: string
    issueId: string
    disabled: boolean
    isInboxIssue?: boolean
    onLabelUpdate?: (labelIds: string[]) => void
}

export type TLabelOperations = {
    updateIssue: (workspaceSlug: string, projectId: string, issueId: string, data: Partial<TIssue>) => Promise<void>
    createLabel: (workspaceSlug: string, projectId: string, data: Partial<IIssueLabel>) => Promise<any>
}

export const IssueLabel: FC<TIssueLabel> = observer((props) => {
    const { workspaceSlug, projectId, issueId, disabled = false, isInboxIssue = false, onLabelUpdate } = props

    const { updateIssue } = useIssueDetail()
    const { createLabel } = useLabel()

    const labelOperations: TLabelOperations = useMemo(
        () => ({
            updateIssue: async (workspaceSlug: string, projectId: string, issueId: string, data: Partial<TIssue>) => {
                try {
                    if (onLabelUpdate) onLabelUpdate(data.label_ids || [])
                    else await updateIssue(workspaceSlug, projectId, issueId, data)
                    if (!isInboxIssue)
                        toast.error({
                            title: "Issue updated successfully",
                            type: "success",
                            message: "Issue updated successfully",
                        })
                } catch (error) {
                    toast.error({
                        title: "Issue update failed",

                        message: "Issue update failed",
                    })
                }
            },
            createLabel: async (workspaceSlug: string, projectId: string, data: Partial<IIssueLabel>) => {
                try {
                    const labelResponse = await createLabel(workspaceSlug, projectId, data)
                    if (!isInboxIssue)
                        toast.error({
                            title: "Label created successfully",
                            type: "success",
                            message: "Label created successfully",
                        })
                    return labelResponse
                } catch (error) {
                    toast.error({
                        title: "Label creation failed",

                        message: "Label creation failed",
                    })
                    return error
                }
            },
        }),
        [updateIssue, createLabel, onLabelUpdate]
    )

    return (
        <div className="relative flex flex-wrap items-center gap-1">
            <LabelList
                workspaceSlug={workspaceSlug}
                projectId={projectId}
                issueId={issueId}
                labelOperations={labelOperations}
                disabled={disabled}
            />

            {!disabled && (
                <IssueLabelSelectRoot
                    workspaceSlug={workspaceSlug}
                    projectId={projectId}
                    issueId={issueId}
                    labelOperations={labelOperations}
                />
            )}

            {!disabled && (
                <LabelCreate
                    workspaceSlug={workspaceSlug}
                    projectId={projectId}
                    issueId={issueId}
                    labelOperations={labelOperations}
                />
            )}
        </div>
    )
})

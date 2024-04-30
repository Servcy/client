import { FC, useMemo } from "react"

import toast from "react-hot-toast"

import { useEventTracker, useIssueDetail } from "@hooks/store"

import { IssueAttachmentUpload } from "./attachment-upload"
import { IssueAttachmentsList } from "./attachments-list"

export type TIssueAttachmentRoot = {
    workspaceSlug: string
    projectId: string
    issueId: string
    disabled?: boolean
}

export type TAttachmentOperations = {
    create: (data: FormData) => Promise<void>
    remove: (linkId: string) => Promise<void>
}

export const IssueAttachmentRoot: FC<TIssueAttachmentRoot> = (props) => {
    // props
    const { workspaceSlug, projectId, issueId, disabled = false } = props

    const { createAttachment, removeAttachment } = useIssueDetail()
    const { captureIssueEvent } = useEventTracker()

    const handleAttachmentOperations: TAttachmentOperations = useMemo(
        () => ({
            create: async (data: FormData) => {
                try {
                    if (!workspaceSlug || !projectId || !issueId) throw new Error("Missing required fields")
                    const res = await createAttachment(workspaceSlug, projectId, issueId, data)
                    captureIssueEvent({
                        eventName: "Issue attachment added",
                        payload: { id: issueId, state: "SUCCESS", element: "Issue detail page" },
                        updates: {
                            changed_property: "attachment",
                            change_details: res.id,
                        },
                    })
                } catch (error) {
                    captureIssueEvent({
                        eventName: "Issue attachment added",
                        payload: { id: issueId, state: "FAILED", element: "Issue detail page" },
                    })
                    toast.error("The attachment could not be uploaded")
                }
            },
            remove: async (attachmentId: string) => {
                try {
                    if (!workspaceSlug || !projectId || !issueId) throw new Error("Missing required fields")
                    await removeAttachment(workspaceSlug, projectId, issueId, attachmentId)
                    toast.error("The attachment has been successfully removed")
                    captureIssueEvent({
                        eventName: "Issue attachment deleted",
                        payload: { id: issueId, state: "SUCCESS", element: "Issue detail page" },
                        updates: {
                            changed_property: "attachment",
                            change_details: "",
                        },
                    })
                } catch (error) {
                    captureIssueEvent({
                        eventName: "Issue attachment deleted",
                        payload: { id: issueId, state: "FAILED", element: "Issue detail page" },
                        updates: {
                            changed_property: "attachment",
                            change_details: "",
                        },
                    })
                    toast.error("The Attachment could not be removed")
                }
            },
        }),
        [workspaceSlug, projectId, issueId, createAttachment, captureIssueEvent, removeAttachment]
    )

    return (
        <div className="relative py-3 space-y-3">
            <h3 className="text-lg">Attachments</h3>
            <div className="grid  grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                <IssueAttachmentUpload
                    workspaceSlug={workspaceSlug}
                    disabled={disabled}
                    handleAttachmentOperations={handleAttachmentOperations}
                />
                <IssueAttachmentsList
                    issueId={issueId}
                    disabled={disabled}
                    handleAttachmentOperations={handleAttachmentOperations}
                />
            </div>
        </div>
    )
}

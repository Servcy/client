import { useMemo } from "react"

import toast from "react-hot-toast"

import { IssueAttachmentsList, IssueAttachmentUpload, TAttachmentOperations } from "@components/issues"

import { useEventTracker, useIssueDetail } from "@hooks/store"

type Props = {
    disabled: boolean
    issueId: string
    projectId: string
    workspaceSlug: string
}

export const PeekOverviewIssueAttachments: React.FC<Props> = (props) => {
    const { disabled, issueId, projectId, workspaceSlug } = props
    // store hooks
    const { captureIssueEvent } = useEventTracker()
    const {
        attachment: { createAttachment, removeAttachment },
    } = useIssueDetail()

    const handleAttachmentOperations: TAttachmentOperations = useMemo(
        () => ({
            create: async (data: FormData) => {
                try {
                    const attachmentUploadPromise = createAttachment(workspaceSlug, projectId, issueId, data)
                    toast.promise(attachmentUploadPromise, {
                        loading: "Uploading attachment...",
                        success: "The attachment has been successfully uploaded",
                        error: "The attachment could not be uploaded",
                    })

                    const res = await attachmentUploadPromise
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
                }
            },
            remove: async (attachmentId: string) => {
                try {
                    if (!workspaceSlug || !projectId || !issueId) throw new Error("Missing required fields")
                    await removeAttachment(workspaceSlug, projectId, issueId, attachmentId)
                    toast.success("The attachment has been successfully removed")
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
        [workspaceSlug, projectId, issueId, captureIssueEvent, createAttachment, removeAttachment]
    )

    return (
        <div>
            <h6 className="text-sm font-medium">Attachments</h6>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2 mt-3">
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

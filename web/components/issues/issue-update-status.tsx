import React from "react"

import { ClipboardCopy, RefreshCw } from "lucide-react"
import { toast } from "react-hot-toast"

import { useProject } from "@hooks/store"

import { TIssue } from "@servcy/types"
import { Tooltip } from "@servcy/ui"

type Props = {
    isSubmitting: "submitting" | "submitted" | "saved"
    issueDetail?: TIssue
}

export const IssueUpdateStatus: React.FC<Props> = (props) => {
    const { isSubmitting, issueDetail } = props
    const { getProjectById } = useProject()
    const projectDetails = issueDetail ? getProjectById(issueDetail.project_id) : undefined
    const copyIssueIdentifierToClipboard = () => {
        if (!projectDetails?.identifier || !issueDetail?.sequence_id || !navigator || !navigator.clipboard) return
        navigator.clipboard.writeText(`${projectDetails?.identifier}-${issueDetail?.sequence_id}`)
        toast.success("Copied Issue Identifier to clipboard")
    }

    return (
        <>
            {issueDetail && (
                <h4 className="mr text-lg font-medium text-custom-text-300">
                    {projectDetails?.identifier}-{issueDetail.sequence_id}
                </h4>
            )}

            <Tooltip tooltipContent="Copy Issue ID" position="top-left">
                <ClipboardCopy
                    className="inline mx-4 cursor-pointer stroke-custom-text-400 size-4"
                    onClick={copyIssueIdentifierToClipboard}
                />
            </Tooltip>
            <div
                className={`flex items-center gap-x-2 transition-all duration-300 ${
                    isSubmitting === "saved" ? "fadeOut" : "fadeIn"
                }`}
            >
                {isSubmitting !== "submitted" && isSubmitting !== "saved" && (
                    <RefreshCw className="h-4 w-4 stroke-custom-text-300" />
                )}
                <span className="text-sm text-custom-text-300">
                    {isSubmitting === "submitting" ? "Saving..." : "Saved"}
                </span>
            </div>
        </>
    )
}

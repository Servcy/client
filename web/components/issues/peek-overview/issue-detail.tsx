import { FC, useEffect } from "react"

import { ClipboardCopy } from "lucide-react"
import { observer } from "mobx-react"
import { toast } from "react-hot-toast"

import { TIssueOperations } from "@components/issues"

// store hooks
import { useIssueDetail, useProject, useUser } from "@hooks/store"
import useReloadConfirmations from "@hooks/use-reload-confirmation"

import { Tooltip } from "@servcy/ui"

import { IssueDescriptionInput } from "../description-input"
import { IssueReaction } from "../issue-detail/reactions"
import { IssueTitleInput } from "../title-input"

interface IPeekOverviewIssueDetails {
    workspaceSlug: string
    projectId: string
    issueId: string
    issueOperations: TIssueOperations
    disabled: boolean
    isSubmitting: "submitting" | "submitted" | "saved"
    setIsSubmitting: (value: "submitting" | "submitted" | "saved") => void
}

export const PeekOverviewIssueDetails: FC<IPeekOverviewIssueDetails> = observer((props) => {
    const { workspaceSlug, issueId, issueOperations, disabled, isSubmitting, setIsSubmitting } = props
    // store hooks
    const { getProjectById } = useProject()
    const { currentUser } = useUser()
    const {
        issue: { getIssueById },
    } = useIssueDetail()

    const { setShowAlert } = useReloadConfirmations(isSubmitting === "submitting")

    useEffect(() => {
        if (isSubmitting === "submitted") {
            setShowAlert(false)
            setTimeout(async () => {
                setIsSubmitting("saved")
            }, 2000)
        } else if (isSubmitting === "submitting") {
            setShowAlert(true)
        }
    }, [isSubmitting, setShowAlert, setIsSubmitting])

    const issue = issueId ? getIssueById(issueId) : undefined
    if (!issue) return <></>

    const projectDetails = getProjectById(issue?.project_id)

    const issueDescription =
        issue.description_html !== undefined || issue.description_html !== null
            ? issue.description_html != ""
                ? issue.description_html
                : "<p></p>"
            : undefined

    const copyIssueIdentifierToClipboard = () => {
        if (!projectDetails?.identifier || !issue?.sequence_id || !navigator || !navigator.clipboard) return
        navigator.clipboard.writeText(`${projectDetails?.identifier}-${issue?.sequence_id}`)
        toast.success("Copied to clipboard")
    }

    return (
        <div className="space-y-2">
            <span className="text-base font-medium text-custom-text-400">
                {projectDetails?.identifier}-{issue?.sequence_id}
                <Tooltip tooltipContent="Copy Issue ID" position="top-left">
                    <ClipboardCopy
                        className="inline ml-2 cursor-pointer stroke-custom-text-400 size-4"
                        onClick={copyIssueIdentifierToClipboard}
                    />
                </Tooltip>
            </span>
            <IssueTitleInput
                workspaceSlug={workspaceSlug}
                projectId={issue.project_id}
                issueId={issue.id}
                isSubmitting={isSubmitting}
                setIsSubmitting={(value) => setIsSubmitting(value)}
                issueOperations={issueOperations}
                disabled={disabled}
                value={issue.name}
            />

            <IssueDescriptionInput
                workspaceSlug={workspaceSlug}
                projectId={issue.project_id}
                issueId={issue.id}
                value={issueDescription}
                initialValue={issueDescription}
                disabled={disabled}
                issueOperations={issueOperations}
                setIsSubmitting={(value) => setIsSubmitting(value)}
            />

            {currentUser && (
                <IssueReaction
                    workspaceSlug={workspaceSlug}
                    projectId={issue.project_id}
                    issueId={issueId}
                    currentUser={currentUser}
                />
            )}
        </div>
    )
})

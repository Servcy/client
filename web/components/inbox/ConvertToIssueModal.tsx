import { usePathname } from "next/navigation"

import React, { useEffect, useState } from "react"

import { Dialog, Transition } from "@headlessui/react"
import { observer } from "mobx-react-lite"
import { Controller, useForm } from "react-hook-form"
import toast from "react-hot-toast"

import { DateDropdown, PriorityDropdown, ProjectDropdown, WorkspaceDropdown } from "@components/dropdowns"

import { useBilling, useEventTracker, useIssues, useMention, useWorkspace } from "@hooks/store"

import { ISSUE_CREATED } from "@constants/event-tracker"
import { EIssuesStoreType } from "@constants/issue"

import { FileService } from "@services/document.service"

import { renderFormattedPayloadDate } from "@helpers/date-time.helper"
import { generateDescription } from "@helpers/inbox.helper"

import { RichTextEditorWithRef } from "@servcy/rich-text-editor"
import { InboxItem, TIssuePriorities } from "@servcy/types"
import { Button, Input } from "@servcy/ui"

export interface ConvertToIssueModalProps {
    isOpen: boolean
    onClose: () => void
    data: InboxItem
}
const fileService = new FileService()

const ConvertToIssueModal: React.FC<ConvertToIssueModalProps> = observer((props) => {
    const { isOpen, onClose, data } = props
    const { fetchWorkspaceSubscription, workspaceSubscriptionMap, getSubscriptionByWorkspaceSlug } = useBilling()
    const [canCreateIssue, setCanCreateIssue] = useState(true)
    const pathname = usePathname()
    const {
        formState: { isSubmitting },
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
    } = useForm({
        defaultValues: {
            workspace_id: null,
            project_id: null,
            name: data.title,
            description_html: generateDescription(data),
            priority: "none",
            start_date: null,
            target_date: null,
        },
    })
    const { workspaces } = useWorkspace()
    const targetDate = watch("target_date")
    const startDate = watch("start_date")
    const workspaceId = watch("workspace_id")
    const projectId = watch("project_id")
    const maxDate = targetDate ? new Date(targetDate) : null
    maxDate?.setDate(maxDate.getDate())
    const minDate = startDate ? new Date(startDate) : null
    minDate?.setDate(minDate.getDate())
    const editorRef = React.useRef<any>(null)
    const { mentionHighlights, mentionSuggestions } = useMention()
    const { captureIssueEvent } = useEventTracker()
    const { issues: projectIssues } = useIssues(EIssuesStoreType.PROJECT)
    const handleFormSubmit = async (formData: any) => {
        const workspaceSlug = workspaces[formData.workspace_id].slug
        const projectId = formData.project_id
        if (!workspaceSlug || !projectId) return
        const payload = {
            project_id: projectId,
            name: formData.name,
            description_html: formData.description_html,
            priority: formData.priority,
            start_date: formData.start_date,
            target_date: formData.target_date,
            estimate_point: null,
            state_id: "",
            parent_id: null,
            assignee_ids: [],
            label_ids: [],
            cycle_id: null,
            module_ids: null,
        }
        try {
            const response = await projectIssues.createIssue(workspaceSlug, projectId, payload)
            if (!response) throw new Error()
            const issueLink = `/${workspaceSlug}/projects/${projectId}/issues/${response.id}`
            window.open(issueLink, "_blank", "noopener noreferrer")
            projectIssues.fetchIssues(workspaceSlug, projectId, "mutation")
            captureIssueEvent({
                eventName: ISSUE_CREATED,
                payload: { ...response, state: "SUCCESS" },
                path: pathname,
            })
            onClose()
        } catch (error) {
            toast.error("Please try again later")
            captureIssueEvent({
                eventName: ISSUE_CREATED,
                payload: { ...payload, state: "FAILED" },
                path: pathname,
            })
        }
        return undefined
    }
    useEffect(() => {
        if (!workspaceId || !workspaces?.[workspaceId] || !workspaces?.[workspaceId]?.slug) return
        fetchWorkspaceSubscription(workspaces?.[workspaceId]?.slug)
    }, [workspaceId, workspaces])
    useEffect(() => {
        if (!workspaceId || !workspaces?.[workspaceId] || !workspaces[workspaceId]?.slug) return
        const currentPlan = getSubscriptionByWorkspaceSlug(workspaces[workspaceId].slug)
        if (currentPlan?.plan_details?.name === "Starter") {
            toast.error("Please upgrade your subscription")
            setCanCreateIssue(false)
        } else {
            setCanCreateIssue(true)
        }
    }, [workspaceSubscriptionMap, workspaceId, workspaces])

    return (
        <Transition.Root show={isOpen} as={React.Fragment}>
            <Dialog
                as="div"
                className="relative z-20"
                onClose={() => {
                    onClose()
                    reset()
                }}
            >
                <Transition.Child
                    as={React.Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-custom-backdrop bg-opacity-50 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="my-10 flex items-center justify-center p-4 text-center sm:p-0 md:my-20">
                        <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform rounded-lg border border-custom-border-200 bg-custom-background-100 p-5 text-left shadow-custom-shadow-md transition-all sm:w-full mx-4 sm:max-w-4xl">
                                <form onSubmit={handleSubmit((data) => handleFormSubmit(data))}>
                                    <div className="space-y-5">
                                        <div className="flex items-center gap-x-2">
                                            <Controller
                                                control={control}
                                                name="workspace_id"
                                                rules={{
                                                    required: true,
                                                }}
                                                render={({ field: { value, onChange } }) => (
                                                    <div className="h-7">
                                                        <WorkspaceDropdown
                                                            value={value}
                                                            dropdownArrow={true}
                                                            onChange={(workspaceId) => {
                                                                onChange(workspaceId)
                                                                setValue("project_id", null)
                                                            }}
                                                            placeholder="Select a workspace"
                                                            buttonVariant="border-with-text"
                                                        />
                                                    </div>
                                                )}
                                            />
                                            <h3 className="text-xl font-semibold leading-6 text-custom-text-100">
                                                Create issue
                                            </h3>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="mt-2 space-y-3">
                                                <Controller
                                                    control={control}
                                                    name="name"
                                                    rules={{
                                                        required: "Title is required",
                                                        maxLength: {
                                                            value: 255,
                                                            message: "Title should be less than 255 characters",
                                                        },
                                                    }}
                                                    render={({ field: { value, ref } }) => (
                                                        <Input
                                                            id="name"
                                                            name="name"
                                                            type="text"
                                                            value={value}
                                                            disabled
                                                            ref={ref}
                                                            placeholder="Issue Title"
                                                            className="resize-none text-xl w-full"
                                                        />
                                                    )}
                                                />
                                                <Controller
                                                    name="description_html"
                                                    control={control}
                                                    render={({ field: { value, onChange } }) => (
                                                        <RichTextEditorWithRef
                                                            cancelUploadImage={fileService.cancelUpload}
                                                            uploadFile={fileService.getUploadFileFunction(workspaceId)}
                                                            deleteFile={fileService.getDeleteImageFunction()}
                                                            restoreFile={fileService.getRestoreImageFunction()}
                                                            ref={editorRef}
                                                            debouncedUpdatesEnabled={false}
                                                            value={
                                                                !value ||
                                                                value === "" ||
                                                                (typeof value === "object" &&
                                                                    Object.keys(value).length === 0)
                                                                    ? watch("description_html")
                                                                    : value
                                                            }
                                                            initialValue={value}
                                                            customClassName="min-h-[7rem] border-custom-border-100"
                                                            onChange={(_: Object, description_html: string) => {
                                                                onChange(description_html)
                                                            }}
                                                            mentionHighlights={mentionHighlights}
                                                            mentionSuggestions={mentionSuggestions}
                                                            // tabIndex={2}
                                                        />
                                                    )}
                                                />
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Controller
                                                        control={control}
                                                        name="priority"
                                                        render={({ field: { value, onChange } }) => (
                                                            <div className="h-7">
                                                                <PriorityDropdown
                                                                    value={value as TIssuePriorities}
                                                                    onChange={(priority) => {
                                                                        onChange(priority)
                                                                    }}
                                                                    buttonVariant="border-with-text"
                                                                />
                                                            </div>
                                                        )}
                                                    />
                                                    <Controller
                                                        control={control}
                                                        name="start_date"
                                                        render={({ field: { value, onChange } }) => (
                                                            <div className="h-7">
                                                                <DateDropdown
                                                                    value={value}
                                                                    onChange={(date) =>
                                                                        onChange(
                                                                            date
                                                                                ? renderFormattedPayloadDate(date)
                                                                                : null
                                                                        )
                                                                    }
                                                                    buttonVariant="border-with-text"
                                                                    maxDate={maxDate ?? undefined}
                                                                    placeholder="Start date"
                                                                />
                                                            </div>
                                                        )}
                                                    />
                                                    <Controller
                                                        control={control}
                                                        name="target_date"
                                                        render={({ field: { value, onChange } }) => (
                                                            <div className="h-7">
                                                                <DateDropdown
                                                                    value={value}
                                                                    onChange={(date) =>
                                                                        onChange(
                                                                            date
                                                                                ? renderFormattedPayloadDate(date)
                                                                                : null
                                                                        )
                                                                    }
                                                                    buttonVariant="border-with-text"
                                                                    minDate={minDate ?? undefined}
                                                                    placeholder="Due date"
                                                                />
                                                            </div>
                                                        )}
                                                    />
                                                    <Controller
                                                        control={control}
                                                        name="project_id"
                                                        rules={{
                                                            required: true,
                                                        }}
                                                        render={({ field: { value, onChange } }) => (
                                                            <div className="h-7">
                                                                <ProjectDropdown
                                                                    value={value}
                                                                    dropdownArrow={true}
                                                                    workspaceId={workspaceId}
                                                                    onChange={(projectId) => {
                                                                        onChange(projectId)
                                                                    }}
                                                                    placeholder="Select a project"
                                                                    buttonVariant="border-with-text"
                                                                />
                                                            </div>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="-mx-5 mt-5 flex items-center justify-between gap-2 border-t border-custom-border-100 px-5 pt-5">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="primary"
                                                type="submit"
                                                size="sm"
                                                loading={isSubmitting}
                                                disabled={!projectId || !workspaceId || !canCreateIssue}
                                            >
                                                {isSubmitting ? "Creating..." : "Create issue"}
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
})

export default ConvertToIssueModal

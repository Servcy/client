import { usePathname } from "next/navigation"

import React from "react"

import { Dialog, Transition } from "@headlessui/react"
import { observer } from "mobx-react-lite"
import { Controller, useForm } from "react-hook-form"
import toast from "react-hot-toast"

import { ProjectDropdown, WorkspaceDropdown } from "@components/dropdowns"

import { useEventTracker, useIssues, useWorkspace } from "@hooks/store"

import { ISSUE_CREATED } from "@constants/event-tracker"
import { EIssuesStoreType } from "@constants/issue"

import { Button, Input } from "@servcy/ui"

export interface ConvertToIssueModalProps {
    isOpen: boolean
    onClose: () => void
    data?: any
}

const ConvertToIssueModal: React.FC<ConvertToIssueModalProps> = observer((props) => {
    const { isOpen, onClose, data } = props
    const pathname = usePathname()
    const {
        formState: { isSubmitting },
        control,
        handleSubmit,
        setValue,
        watch,
    } = useForm()
    const { workspaces } = useWorkspace()
    const workspaceId = watch("workspace_id")
    const { captureIssueEvent } = useEventTracker()
    const projectId = watch("project_id")
    const { issues: projectIssues } = useIssues(EIssuesStoreType.PROJECT)
    const handleFormSubmit = async (formData: any) => {
        const workspaceSlug = workspaces[formData.workspace_id].slug
        const projectId = formData.project_id
        if (!workspaceSlug || !projectId) return
        const payload = {
            project_id: projectId,
            name: data?.title ?? "",
            description_html: "<p></p>",
            estimate_point: null,
            state_id: "",
            parent_id: null,
            priority: "none",
            assignee_ids: [],
            label_ids: [],
            cycle_id: null,
            module_ids: null,
            start_date: null,
            target_date: null,
        }
        try {
            const response = await projectIssues.createIssue(workspaceSlug, projectId, payload)
            if (!response) throw new Error()
            projectIssues.fetchIssues(workspaceSlug, projectId, "mutation")
            toast.success("Issue created successfully.")
            captureIssueEvent({
                eventName: ISSUE_CREATED,
                payload: { ...response, state: "SUCCESS" },
                path: pathname,
            })
            onClose()
        } catch (error) {
            toast.error("Issue could not be created. Please try again.")
            captureIssueEvent({
                eventName: ISSUE_CREATED,
                payload: { ...payload, state: "FAILED" },
                path: pathname,
            })
        }
        return undefined
    }

    return (
        <Transition.Root show={isOpen} as={React.Fragment}>
            <Dialog as="div" className="relative z-20" onClose={onClose}>
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
                                                    render={({ field: { ref } }) => (
                                                        <Input
                                                            id="name"
                                                            name="name"
                                                            type="text"
                                                            value={data?.title}
                                                            disabled
                                                            ref={ref}
                                                            placeholder="Issue Title"
                                                            className="resize-none text-xl w-full"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 my-5">
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
                                    <div className="-mx-5 flex items-center justify-between gap-2 border-t border-custom-border-100 px-5 pt-5">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="primary"
                                                type="submit"
                                                size="sm"
                                                loading={isSubmitting}
                                                disabled={!projectId || !workspaceId}
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

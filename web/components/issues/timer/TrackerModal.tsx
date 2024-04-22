import { useParams } from "next/navigation"

import React, { useEffect } from "react"

import { Dialog, Transition } from "@headlessui/react"
import { Timer } from "lucide-react"
import { observer } from "mobx-react-lite"
import { Controller, useForm } from "react-hook-form"

import { IssueDropdown, ProjectDropdown } from "@components/dropdowns"

import { useProject, useWorkspace } from "@hooks/store"

import type { ITrackedTime } from "@servcy/types"
import { Button, Checkbox, TextArea } from "@servcy/ui"

interface IssuesModalProps {
    isOpen: boolean
    handleClose: () => void
}

const getTabIndex = (key: string) =>
    ["project_id", "issue_id", "description", "is_billable", "discard_button", "submit_button"].findIndex(
        (tabIndex) => tabIndex === key
    ) + 1

const defaultValues: Partial<ITrackedTime> = {
    description: "",
    project_id: null,
    issue_id: null,
    is_billable: true,
}

export const IssueTimeTrackerModal: React.FC<IssuesModalProps> = observer((props) => {
    const { issueId, projectId, workspaceSlug } = useParams()
    const { isOpen, handleClose } = props
    const { getWorkspaceBySlug } = useWorkspace()
    const { workspaceProjectIds, getProjectById } = useProject()
    const {
        formState: { errors, isSubmitting },
        handleSubmit,
        reset,
        watch,
        control,
        setValue,
    } = useForm<ITrackedTime>({
        defaultValues,
        reValidateMode: "onChange",
    })
    const onClose = () => {
        handleClose(true)
        reset(defaultValues)
    }
    const handleFormSubmit = async (formData: Partial<ITrackedTime>) => {
        console.log(formData)
        onClose()
    }
    const activeProjectId = watch("project_id")
    useEffect(() => {
        if (issueId) setValue("issue_id", issueId)
        if (projectId) setValue("project_id", projectId)
        if (workspaceProjectIds && workspaceProjectIds.length > 0 && !activeProjectId)
            setValue("project_id", workspaceProjectIds[0])
    }, [issueId, projectId, workspaceProjectIds, activeProjectId, isOpen])
    if (!workspaceProjectIds || workspaceProjectIds.length === 0) return null
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
                                                            onChange={onChange}
                                                            buttonVariant="border-with-text"
                                                            tabIndex={getTabIndex("project_id")}
                                                        />
                                                    </div>
                                                )}
                                            />
                                            <h3 className="text-xl font-semibold leading-6 text-custom-text-100">
                                                Start Timer
                                            </h3>
                                        </div>
                                        <Controller
                                            name="description"
                                            control={control}
                                            render={({ field: { value, onChange } }) => (
                                                <TextArea
                                                    id="description"
                                                    name="description"
                                                    value={value}
                                                    placeholder="Description..."
                                                    onChange={onChange}
                                                    className="!h-24 text-sm focus:border-green-300"
                                                    hasError={Boolean(errors?.description)}
                                                    tabIndex={getTabIndex("description")}
                                                />
                                            )}
                                        />
                                        {activeProjectId && workspaceSlug && (
                                            <Controller
                                                name="issue_id"
                                                control={control}
                                                rules={{ required: "Issue needs to be selected" }}
                                                render={({ field: { value, onChange } }) => (
                                                    <IssueDropdown
                                                        value={value}
                                                        onChange={onChange}
                                                        project={getProjectById(activeProjectId)}
                                                        workspace={getWorkspaceBySlug(workspaceSlug.toString())}
                                                        buttonVariant="border-with-text"
                                                        tabIndex={getTabIndex("project_id")}
                                                        className="h-8"
                                                    />
                                                )}
                                            />
                                        )}
                                        <div className="flex gap-2 items-center">
                                            <div className="grow text-sm font-normal text-custom-text-300">
                                                Is this time entry billable?
                                            </div>
                                            <div className="shrink-0">
                                                <Controller
                                                    control={control}
                                                    name="is_billable"
                                                    render={({ field: { value, onChange } }) => (
                                                        <Checkbox
                                                            checked={value}
                                                            onChange={() => onChange(!value)}
                                                            className="mx-2"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 justify-end mt-8">
                                        <Button
                                            variant="neutral-primary"
                                            size="sm"
                                            onClick={onClose}
                                            tabIndex={getTabIndex("discard_button")}
                                        >
                                            Discard
                                        </Button>
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            size="sm"
                                            loading={isSubmitting}
                                            tabIndex={getTabIndex("submit_button")}
                                        >
                                            <Timer className="size-4 mr-1" />
                                            Start Timer
                                        </Button>
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

import React from "react"

import { Dialog, Transition } from "@headlessui/react"
import { observer } from "mobx-react-lite"
import { Controller, useForm } from "react-hook-form"

import { ProjectDropdown, WorkspaceDropdown } from "@components/dropdowns"

import { Button } from "@servcy/ui"

export interface ConvertToIssueModalProps {
    isOpen: boolean
    onClose: () => void
}

const ConvertToIssueModal: React.FC<ConvertToIssueModalProps> = observer((props) => {
    const { isOpen, onClose } = props
    const {
        formState: { isSubmitting },
        control,
    } = useForm()

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
                                <form>
                                    <div className="space-y-5">
                                        <div className="flex items-center gap-x-2">
                                            <h3 className="text-xl font-semibold leading-6 text-custom-text-100">
                                                Create issue
                                            </h3>
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
                                                        onChange={(projectId) => {
                                                            onChange(projectId)
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
                                            <Button variant="primary" type="submit" size="sm" loading={isSubmitting}>
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

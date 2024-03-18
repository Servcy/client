import { useParams } from "next/navigation"

import React, { FC, useEffect, useState } from "react"

import { Dialog, Transition } from "@headlessui/react"
import toast from "react-hot-toast"

import { useEventTracker, useProject } from "@hooks/store"
import { useProjectPages } from "@hooks/store/use-project-page"

import { PAGE_CREATED, PAGE_UPDATED } from "@constants/event-tracker"

import { IPageStore } from "@store/page.store"

import { IPage } from "@servcy/types"

import { PageForm } from "./page-form"

type Props = {
    pageStore?: IPageStore
    handleClose: () => void
    isOpen: boolean
    projectId?: string
}

export const CreateUpdatePageModal: FC<Props> = (props) => {
    const { isOpen, handleClose, projectId, pageStore } = props
    const { workspaceSlug } = useParams()
    const [activeProject, setActiveProject] = useState<string | null>(null)
    // store hooks
    const { createPage } = useProjectPages()
    const { capturePageEvent } = useEventTracker()
    const { workspaceProjectIds } = useProject()

    const createProjectPage = async (payload: IPage) => {
        if (!workspaceSlug || !activeProject) return
        await createPage(workspaceSlug.toString(), activeProject, payload)
            .then((res) => {
                capturePageEvent({
                    eventName: PAGE_CREATED,
                    payload: {
                        ...res,
                        state: "SUCCESS",
                    },
                })
                toast.success("Page created successfully")
            })
            .catch(() => {
                capturePageEvent({
                    eventName: PAGE_CREATED,
                    payload: {
                        state: "FAILED",
                    },
                })
                toast.error("Failed to create page")
            })
    }

    const handleFormSubmit = async (formData: IPage) => {
        if (!workspaceSlug || !activeProject) return
        try {
            if (pageStore) {
                if (pageStore.name !== formData.name) {
                    await pageStore.updateName(formData.name)
                }
                if (pageStore.access !== formData.access) {
                    formData.access === 1 ? await pageStore.makePrivate() : await pageStore.makePublic()
                }
                capturePageEvent({
                    eventName: PAGE_UPDATED,
                    payload: {
                        ...pageStore,
                        state: "SUCCESS",
                    },
                })
            } else {
                await createProjectPage(formData)
            }
            handleClose()
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        // if modal is closed, reset active project to null
        // and return to avoid activeProject being set to some other project
        if (!isOpen) {
            setActiveProject(null)
            return
        }

        // if data is present, set active project to the project of the
        // issue. This has more priority than the project in the url.
        if (pageStore && pageStore.project) {
            setActiveProject(pageStore.project)
            return
        }

        // if data is not present, set active project to the project
        // in the url. This has the least priority.
        if (workspaceProjectIds && workspaceProjectIds.length > 0 && !activeProject)
            setActiveProject(projectId ?? workspaceProjectIds?.[0] ?? null)
    }, [activeProject, projectId, workspaceProjectIds, isOpen])

    return (
        <Transition.Root show={isOpen} as={React.Fragment}>
            <Dialog as="div" className="relative z-20" onClose={handleClose}>
                <Transition.Child
                    as={React.Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-custom-backdrop transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-20 overflow-y-auto">
                    <div className="my-10 flex justify-center p-4 text-center sm:p-0 md:my-20">
                        <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform rounded-lg bg-custom-background-100 p-5 px-4 text-left shadow-custom-shadow-md transition-all w-full sm:max-w-2xl">
                                <PageForm
                                    handleFormSubmit={handleFormSubmit}
                                    handleClose={handleClose}
                                    projectId={activeProject ?? ""}
                                    setActiveProject={setActiveProject}
                                    pageStore={pageStore}
                                />
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

import { FC, Fragment, useEffect, useState } from "react"

import { Dialog, Transition } from "@headlessui/react"
import { observer } from "mobx-react-lite"
import toast from "react-hot-toast"

import { ProjectViewForm } from "@components/views"

import { useProject, useProjectView } from "@hooks/store"

import { IProjectView } from "@servcy/types"

type Props = {
    data?: IProjectView | null
    isOpen: boolean
    onClose: () => void
    preLoadedData?: Partial<IProjectView> | null
    workspaceSlug: string
    projectId?: string
}

export const CreateUpdateProjectViewModal: FC<Props> = observer((props) => {
    const { data, isOpen, onClose, preLoadedData, workspaceSlug, projectId } = props
    // states
    const [activeProject, setActiveProject] = useState<string | null>(null)
    // store hooks
    const { createView, updateView } = useProjectView()
    const { workspaceProjectIds } = useProject()

    const handleClose = () => {
        onClose()
    }

    const handleCreateView = async (payload: IProjectView) => {
        if (!activeProject) return
        await createView(workspaceSlug, activeProject, payload)
            .then(() => {
                handleClose()
                toast.success("View created successfully.")
            })
            .catch(() => toast.error("Something went wrong. Please try again."))
    }

    const handleUpdateView = async (payload: IProjectView) => {
        if (!activeProject) return
        await updateView(workspaceSlug, activeProject, data?.id as string, payload)
            .then(() => handleClose())
            .catch((err) => toast.error(err.detail ?? "Something went wrong. Please try again."))
    }

    const handleFormSubmit = async (formData: IProjectView) => {
        if (!data) await handleCreateView(formData)
        else await handleUpdateView(formData)
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
        if (data && data.project) {
            setActiveProject(data.project)
            return
        }

        // if data is not present, set active project to the project
        // in the url. This has the least priority.
        if (workspaceProjectIds && workspaceProjectIds.length > 0 && !activeProject)
            setActiveProject(projectId ?? workspaceProjectIds?.[0] ?? null)
    }, [activeProject, data, projectId, workspaceProjectIds, isOpen])

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-20" onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
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
                    <div className="my-10 flex items-center justify-center p-4 text-center sm:p-0 md:my-20">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform rounded-lg bg-custom-background-100 px-5 py-8 text-left shadow-custom-shadow-md transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                                <ProjectViewForm
                                    data={data}
                                    projectId={activeProject ?? ""}
                                    handleClose={handleClose}
                                    handleFormSubmit={handleFormSubmit}
                                    setActiveProject={setActiveProject}
                                    preLoadedData={preLoadedData}
                                />
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
})

import { useParams } from "next/navigation"

import React, { FC, useEffect, useMemo } from "react"

import { Dialog, Transition } from "@headlessui/react"
import { AlertTriangle } from "lucide-react"
import { observer } from "mobx-react-lite"
import toast from "react-hot-toast"

import { useTimeTracker } from "@hooks/store"

import { Button } from "@servcy/ui"

import { SnapshotsList } from "./snapshot-list"
import { TimeTrackerSnapshotUpload } from "./snapshot-upload"

export type TSnapshotOperations = {
    create: (data: FormData) => Promise<void>
    remove: (linkId: string) => Promise<void>
}

export type TStopTimeTrackerModal = {
    isConfirmationModalOpen: boolean
    setIsConfirmationModalOpen: (value: boolean) => void
}

export const StopTimeTrackerModal: FC<TStopTimeTrackerModal> = observer(
    ({ isConfirmationModalOpen, setIsConfirmationModalOpen }) => {
        const { stopTrackingTime, runningTimeTracker, createSnapshot, removeSnapshot, fetchSnapshots } =
            useTimeTracker()
        const { workspaceSlug } = useParams()

        const handleSnapshotOperations: TSnapshotOperations = useMemo(
            () => ({
                create: async (data: FormData) => {
                    try {
                        if (!runningTimeTracker) return
                        await createSnapshot(runningTimeTracker["id"], data)
                        toast.success("The snapshot has been successfully uploaded")
                    } catch (error) {
                        toast.error("The snapshot could not be uploaded")
                    }
                },
                remove: async (snapshotId: string) => {
                    try {
                        if (!runningTimeTracker) return
                        await removeSnapshot(runningTimeTracker["id"], snapshotId)
                        toast.success("The snapshot has been successfully removed")
                    } catch (error) {
                        toast.error("The Snapshot could not be removed")
                    }
                },
            }),
            [runningTimeTracker]
        )

        useEffect(() => {
            if (isConfirmationModalOpen && runningTimeTracker) {
                fetchSnapshots(runningTimeTracker["id"])
            }
        }, [isConfirmationModalOpen])

        if (!runningTimeTracker) return <></>

        return (
            <Transition.Root show={isConfirmationModalOpen} as={React.Fragment}>
                <Dialog as="div" className="relative z-20" onClose={() => setIsConfirmationModalOpen(false)}>
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
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={React.Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-custom-background-100 text-left shadow-custom-shadow-md transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                                    <form className="flex flex-col gap-6 p-6" onSubmit={(e) => e.preventDefault()}>
                                        <div className="flex w-full items-center justify-start gap-6">
                                            <span className="place-items-center rounded-full bg-orange-500/20 p-4">
                                                <AlertTriangle className="h-6 w-6 text-orange-600" aria-hidden="true" />
                                            </span>
                                            <div>
                                                <h3 className="text-xl font-medium 2xl:text-2xl">Stop Tracking</h3>
                                                <p className="text-sm leading-7 text-custom-text-200">
                                                    Are you sure you want to stop the timer?
                                                </p>
                                            </div>
                                        </div>
                                        <div className="relative py-3 space-y-3">
                                            <h3 className="text-lg">Snapshots</h3>
                                            <TimeTrackerSnapshotUpload
                                                workspaceSlug={workspaceSlug.toString()}
                                                handleSnapshotOperations={handleSnapshotOperations}
                                            />
                                            <SnapshotsList
                                                timeTrackedId={runningTimeTracker["id"] as string}
                                                handleSnapshotOperations={handleSnapshotOperations}
                                            />
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="neutral-primary"
                                                size="sm"
                                                onClick={() => setIsConfirmationModalOpen(false)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    stopTrackingTime(workspaceSlug.toString())
                                                }}
                                            >
                                                Stop Timer
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
    }
)

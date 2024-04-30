import { useParams } from "next/navigation"

import React, { FC, useEffect, useMemo, useState } from "react"

import { Dialog, Transition } from "@headlessui/react"
import { AlertTriangle } from "lucide-react"
import { observer } from "mobx-react-lite"
import toast from "react-hot-toast"

import { SnapshotsList, TimeTrackerSnapshotUpload } from "@components/time-tracker"

import { useApplication, useTimeTracker } from "@hooks/store"

import { calculateTimeAgo, renderFormattedDateTime } from "@helpers/date-time.helper"

import { Button } from "@servcy/ui"

export type TSnapshotOperations = {
    create: (data: FormData) => Promise<void>
    remove: (linkId: string) => Promise<void>
}

export type TStopTimeTrackerModal = {
    isOpen: boolean
    handleClose: () => void
}

export const StopTimeTrackerModal: FC<TStopTimeTrackerModal> = observer(({ isOpen, handleClose }) => {
    const { stopTrackingTime, runningTimeTracker, createSnapshot, removeSnapshot, fetchSnapshots } = useTimeTracker()
    const [currentTime, setCurrentTime] = useState(new Date())
    const { workspaceSlug } = useParams()
    const {
        commandPalette: { toggleTimeTrackerModal },
    } = useApplication()
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    const handleSnapshotOperations: TSnapshotOperations = useMemo(
        () => ({
            create: async (data: FormData) => {
                try {
                    if (!runningTimeTracker) return
                    await createSnapshot(runningTimeTracker["id"], data)
                } catch (error) {
                    toast.error("Please try again later")
                }
            },
            remove: async (snapshotId: string) => {
                try {
                    if (!runningTimeTracker) return
                    await removeSnapshot(runningTimeTracker["id"], snapshotId)
                } catch (error) {
                    toast.error("Please try again later")
                }
            },
        }),
        [runningTimeTracker]
    )

    useEffect(() => {
        if (isOpen && runningTimeTracker) {
            fetchSnapshots(runningTimeTracker["id"])
        }
    }, [isOpen])

    if (!runningTimeTracker) return <></>

    return (
        <Transition.Root show={isOpen} as={React.Fragment}>
            <Dialog as="div" className="relative z-20" onClose={() => handleClose()}>
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
                                <form className="flex flex-col gap-2 p-6" onSubmit={(e) => e.preventDefault()}>
                                    <div className="flex w-full items-center justify-start gap-6">
                                        <span className="place-items-center rounded-full bg-orange-500/20 p-4">
                                            <AlertTriangle className="h-6 w-6 text-orange-600" aria-hidden="true" />
                                        </span>
                                        <div>
                                            <h3 className="text-xl font-medium 2xl:text-2xl">Stop Tracking</h3>
                                            <p className="text-sm text-custom-text-200">
                                                If the total log time is less than 5 minutes, it will be discarded.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="relative py-3 space-y-3">
                                        <h3 className="text-lg">Issue</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-custom-text-200">
                                                {runningTimeTracker["project_detail"]["identifier"]}
                                            </span>
                                            <span className="text-sm text-custom-text-100">
                                                {runningTimeTracker["issue_detail"]["name"]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="relative py-3 space-y-3">
                                        <h3 className="text-lg">
                                            Time Log:{" "}
                                            <pre className="inline text-sm bg-custom-background-80 rounded-md p-2">
                                                {calculateTimeAgo(runningTimeTracker["start_time"], {
                                                    addSuffix: false,
                                                    includeSeconds: true,
                                                })}
                                            </pre>
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <pre className="text-sm bg-custom-background-80 rounded-md p-2">
                                                {renderFormattedDateTime(runningTimeTracker["start_time"])}
                                            </pre>
                                            -
                                            <pre className="text-sm bg-custom-background-80 rounded-md p-2">
                                                {renderFormattedDateTime(currentTime)}
                                            </pre>
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
                                        <Button variant="neutral-primary" size="sm" onClick={() => handleClose()}>
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                stopTrackingTime(workspaceSlug.toString())
                                                toggleTimeTrackerModal(false)
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
})

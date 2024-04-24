import React, { FC, useEffect } from "react"

import { Dialog, Transition } from "@headlessui/react"
import { AlertTriangle } from "lucide-react"
import { observer } from "mobx-react-lite"

import { SnapshotsList } from "@components/time-tracker"

import { useTimeTracker } from "@hooks/store"

import { calculateTimeBetween, renderFormattedDateTime } from "@helpers/date-time.helper"

import { ITrackedTime } from "@servcy/types"
import { Button } from "@servcy/ui"

type TDeleteTimeLogModal = {
    isOpen: boolean
    handleClose: () => void
    timeLog: ITrackedTime
    onSubmit: () => Promise<void>
}

export const DeleteTimeLogModal: FC<TDeleteTimeLogModal> = observer(({ onSubmit, isOpen, timeLog, handleClose }) => {
    const { fetchSnapshots } = useTimeTracker()
    useEffect(() => {
        if (isOpen && timeLog) {
            fetchSnapshots(timeLog.id)
        }
    }, [isOpen])
    if (!timeLog) return <></>
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
                                            <h3 className="text-xl font-medium 2xl:text-2xl">Delete Time Log</h3>
                                            <p className="text-sm text-custom-text-200">
                                                This log will be deleted permanently. Are you sure you want to delete
                                                this log?
                                            </p>
                                        </div>
                                    </div>
                                    <div className="relative py-3 space-y-3">
                                        <h3 className="text-lg">Issue</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-custom-text-200">
                                                {timeLog["project_detail"]["identifier"]}
                                            </span>
                                            <span className="text-sm text-custom-text-100">
                                                {timeLog["issue_detail"]["name"]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="relative py-3 space-y-3">
                                        <h3 className="text-lg">Description</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-custom-text-200">
                                                {timeLog["description"] || "No description"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="relative py-3 space-y-3">
                                        <h3 className="text-lg">
                                            Time Log:{" "}
                                            <pre className="inline text-sm bg-custom-background-80 rounded-md p-2">
                                                {calculateTimeBetween(timeLog.start_time, timeLog.end_time, {
                                                    addSuffix: false,
                                                    includeSeconds: true,
                                                })}
                                            </pre>
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <pre className="text-sm bg-custom-background-80 rounded-md p-2">
                                                {renderFormattedDateTime(timeLog.start_time)}
                                            </pre>
                                            -
                                            <pre className="text-sm bg-custom-background-80 rounded-md p-2">
                                                {renderFormattedDateTime(timeLog.end_time)}
                                            </pre>
                                        </div>
                                    </div>
                                    {timeLog.snapshots.length > 0 && (
                                        <div className="relative py-3 space-y-3">
                                            <h3 className="text-lg">Snapshots</h3>
                                            <SnapshotsList
                                                timeTrackedId={timeLog["id"] as string}
                                                deleteSnapshotDisabled={true}
                                            />
                                        </div>
                                    )}
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
                                                onSubmit()
                                            }}
                                        >
                                            Delete
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

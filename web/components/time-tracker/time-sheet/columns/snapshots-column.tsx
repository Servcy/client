import React, { FC, useState } from "react"

import { Dialog, Transition } from "@headlessui/react"
import { Camera, Eye } from "lucide-react"

import { SnapshotsDetail } from "@components/time-tracker"

import { ITrackedTime } from "@servcy/types"

export const SnapshotsColumn: FC<{
    tableCellRef: React.RefObject<HTMLTableCellElement>
    timeLog: ITrackedTime
}> = ({ tableCellRef, timeLog }) => {
    const [showSnapshots, setShowSnapshots] = useState(false)
    return (
        <td
            tabIndex={0}
            className="bg-custom-background-100 after:border-custom-border-100 border-custom-border-100 h-11 w-full min-w-[8rem] border-r-[1px] text-sm after:absolute after:bottom-[-1px] after:w-full after:border"
            ref={tableCellRef}
        >
            <div className="border-custom-border-200 hover:bg-custom-background-80 flex h-11 w-full items-center justify-between border-b-[0.5px] px-4 py-1 text-xs">
                {timeLog.snapshots.length} {timeLog.snapshots.length === 1 ? "snapshot" : "snapshots"}
                {timeLog.snapshots.length > 0 && <Eye className="ml-2 size-3" onClick={() => setShowSnapshots(true)} />}
            </div>
            <Transition.Root show={showSnapshots} as={React.Fragment}>
                <Dialog as="div" className="relative z-20" onClose={() => setShowSnapshots(false)}>
                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="bg-custom-backdrop fixed inset-0 transition-opacity" />
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
                                <Dialog.Panel className="bg-custom-background-100 shadow-custom-shadow-md relative transform overflow-hidden rounded-lg text-left transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                                    <div className="p-6 space-y-6">
                                        <div className="flex w-full items-center justify-start gap-6">
                                            <span className="place-items-center rounded-full bg-green-500/20 p-4">
                                                <Camera
                                                    className="h-6 w-6 text-custom-primary-100"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                            <div>
                                                <h3 className="text-xl font-medium 2xl:text-2xl">Snapshots</h3>
                                                <p className="text-sm text-custom-text-200">
                                                    Snapshots cannot be deleted once submitted during the time log.
                                                </p>
                                            </div>
                                        </div>
                                        {timeLog.snapshots.length > 0 && (
                                            <div className="flex flex-wrap gap-4">
                                                {timeLog.snapshots?.map((snapshot) => (
                                                    <SnapshotsDetail
                                                        snapshotId={snapshot.id}
                                                        key={snapshot.id}
                                                        deleteSnapshotDisabled={true}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </td>
    )
}

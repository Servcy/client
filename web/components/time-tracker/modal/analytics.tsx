import { useParams } from "next/navigation"

import React, { FC, useState } from "react"

import { Dialog, Transition } from "@headlessui/react"
import { Expand, Shrink, X } from "lucide-react"
import { observer } from "mobx-react-lite"
import useSWR from "swr"

import { useTimeTracker } from "@hooks/store"

import { AnalyticsService } from "@services/analytics.service"

import { Button, Loader } from "@servcy/ui"

interface ITimesheetAnalyticsModal {
    isOpen: boolean
    onClose: () => void
    activeLayout: "my-timesheet" | "workspace-timesheet"
}

const analyticsService = new AnalyticsService()

export const TimesheetAnalyticsModal: FC<ITimesheetAnalyticsModal> = observer((props) => {
    const { onClose, isOpen, activeLayout } = props
    const { workspaceSlug } = useParams()
    const {} = useTimeTracker()
    const [fullScreen, setFullScreen] = useState(false)
    const handleClose = () => {
        onClose()
    }
    const {
        data: analytics,
        error: analyticsError,
        mutate: mutateAnalytics,
    } = useSWR(
        workspaceSlug
            ? `TIMESHEET_ANALYTICS_${workspaceSlug.toString().toUpperCase()}_${activeLayout.toUpperCase()}`
            : null,
        workspaceSlug ? () => analyticsService.getTimesheetAnalytics(workspaceSlug.toString(), activeLayout) : null
    )

    return (
        <Transition.Root appear show={isOpen} as={React.Fragment}>
            <Dialog as="div" className="relative z-20" onClose={handleClose}>
                <Transition.Child
                    as={React.Fragment}
                    enter="transition-transform duration-300"
                    enterFrom="translate-x-full"
                    enterTo="translate-x-0"
                    leave="transition-transform duration-200"
                    leaveFrom="translate-x-0"
                    leaveTo="translate-x-full"
                >
                    <Dialog.Panel className="fixed inset-0 z-20 h-full w-full overflow-y-auto">
                        <div
                            className={`bg-custom-background-100 shadow-custom-shadow-md fixed right-0 top-0 z-20 h-full ${
                                fullScreen ? "w-full p-2" : "w-full sm:w-full md:w-1/2"
                            }`}
                        >
                            <div
                                className={`border-custom-border-200 bg-custom-background-100 flex h-full flex-col overflow-hidden text-left ${
                                    fullScreen ? "rounded-lg border" : "border-l"
                                }`}
                            >
                                <div className="bg-custom-background-100 flex items-center justify-between gap-4 px-5 py-4 text-sm">
                                    <h3 className="break-words">
                                        {activeLayout === "my-timesheet" ? "My Analytics" : "Workspace Analytics"}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            className="text-custom-text-200 hover:text-custom-text-100 grid place-items-center p-1"
                                            onClick={() => setFullScreen((prevData) => !prevData)}
                                        >
                                            {fullScreen ? (
                                                <Shrink size={14} strokeWidth={2} />
                                            ) : (
                                                <Expand size={14} strokeWidth={2} />
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            className="text-custom-text-200 hover:text-custom-text-100 grid place-items-center p-1"
                                            onClick={handleClose}
                                        >
                                            <X size={14} strokeWidth={2} />
                                        </button>
                                    </div>
                                </div>
                                {!analyticsError ? (
                                    analytics ? (
                                        <div className="vertical-scrollbar scrollbar-lg h-full overflow-y-auto p-5 text-sm">
                                            <div
                                                className={`grid grid-cols-1 gap-5 ${
                                                    fullScreen ? "md:grid-cols-2" : ""
                                                }`}
                                            >
                                                Work in progress...
                                            </div>
                                        </div>
                                    ) : (
                                        <Loader className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-2">
                                            <Loader.Item height="250px" />
                                            <Loader.Item height="250px" />
                                            <Loader.Item height="250px" />
                                            <Loader.Item height="250px" />
                                        </Loader>
                                    )
                                ) : (
                                    <div className="grid h-full place-items-center p-5">
                                        <div className="text-custom-text-200 space-y-4">
                                            <p className="text-sm">There was some error in fetching the data.</p>
                                            <div className="flex items-center justify-center gap-2">
                                                <Button variant="primary" onClick={() => mutateAnalytics()}>
                                                    Refresh
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Dialog.Panel>
                </Transition.Child>
            </Dialog>
        </Transition.Root>
    )
})

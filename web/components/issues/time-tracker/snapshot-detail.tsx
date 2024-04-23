import Link from "next/link"

import { FC, useState } from "react"

import { AlertCircle, X } from "lucide-react"

import { getFileIcon } from "@components/icons"

import { useMember, useTimeTracker } from "@hooks/store"

import { convertBytesToSize, getFileExtension, getFileName } from "@helpers/attachment.helper"
import { renderFormattedDate } from "@helpers/date-time.helper"
import { truncateText } from "@helpers/string.helper"

import { Tooltip } from "@servcy/ui"

import { SnapshotDeleteModal } from "./delete-snapshot-confirmation-modal"
import { TSnapshotOperations } from "./StopTimeTrackerModal"

type TSnapshotOperationsRemoveModal = Exclude<TSnapshotOperations, "create">

type TSnapshotsDetail = {
    snapshotId: string
    handleSnapshotOperations?: TSnapshotOperationsRemoveModal
    deleteSnapshotDisabled?: boolean
}

export const SnapshotsDetail: FC<TSnapshotsDetail> = (props) => {
    const { snapshotId, handleSnapshotOperations, deleteSnapshotDisabled = false } = props
    const { getUserDetails } = useMember()
    const { getSnapshotById } = useTimeTracker()
    const [snapshotDeleteModal, setSnapshotDeleteModal] = useState<boolean>(false)
    const snapshot = snapshotId && getSnapshotById(snapshotId)
    if (!snapshot) return <></>
    return (
        <>
            {!deleteSnapshotDisabled && handleSnapshotOperations && (
                <SnapshotDeleteModal
                    isOpen={snapshotDeleteModal}
                    setIsOpen={setSnapshotDeleteModal}
                    handleSnapshotOperations={handleSnapshotOperations}
                    data={snapshot}
                />
            )}
            <div
                key={snapshotId}
                className="flex h-[60px] items-center justify-between gap-1 rounded-md border-[2px] border-custom-border-200 bg-custom-background-100 px-4 py-2 text-sm"
            >
                <Link href={snapshot.file} target="_blank" rel="noopener noreferrer">
                    <div className="flex items-center gap-3">
                        <div className="h-7 w-7">{getFileIcon(getFileExtension(snapshot.file))}</div>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <Tooltip tooltipContent={getFileName(snapshot.meta_data.name)}>
                                    <span className="text-sm">
                                        {truncateText(`${getFileName(snapshot.meta_data.name)}`, 10)}
                                    </span>
                                </Tooltip>
                                <Tooltip
                                    tooltipContent={`${
                                        getUserDetails(snapshot.updated_by)?.display_name ?? ""
                                    } uploaded on ${renderFormattedDate(snapshot.updated_at)}`}
                                >
                                    <span>
                                        <AlertCircle className="h-3 w-3" />
                                    </span>
                                </Tooltip>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-custom-text-200">
                                <span>{getFileExtension(snapshot.file).toUpperCase()}</span>
                                <span>{convertBytesToSize(snapshot.meta_data.size)}</span>
                            </div>
                        </div>
                    </div>
                </Link>
                {!deleteSnapshotDisabled && (
                    <button
                        onClick={() => {
                            setSnapshotDeleteModal(true)
                        }}
                    >
                        <X className="h-4 w-4 text-custom-text-200 hover:text-custom-text-100" />
                    </button>
                )}
            </div>
        </>
    )
}

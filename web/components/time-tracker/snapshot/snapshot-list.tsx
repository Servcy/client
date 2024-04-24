import { FC } from "react"

import { observer } from "mobx-react-lite"

import { SnapshotsDetail, TSnapshotOperations } from "@components/time-tracker"

import { useTimeTracker } from "@hooks/store"

type TSnapshotOperationsRemoveModal = Exclude<TSnapshotOperations, "create">

type TIssueSnapshotsList = {
    timeTrackedId: string
    handleSnapshotOperations: TSnapshotOperationsRemoveModal
}

export const SnapshotsList: FC<TIssueSnapshotsList> = observer((props) => {
    const { timeTrackedId, handleSnapshotOperations } = props
    const { getSnapshotsByTimeTrackedId } = useTimeTracker()
    const snapshotIds = getSnapshotsByTimeTrackedId(timeTrackedId)
    if (!snapshotIds) return <></>
    return (
        <div className="flex flex-wrap gap-4">
            {snapshotIds?.map((snapshotId) => (
                <SnapshotsDetail
                    snapshotId={snapshotId}
                    key={snapshotId}
                    handleSnapshotOperations={handleSnapshotOperations}
                />
            ))}
        </div>
    )
})

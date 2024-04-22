import { FC } from "react"

import { observer } from "mobx-react-lite"

import { useTimeTracker } from "@hooks/store"

import { SnapshotsDetail } from "./snapshot-detail"
import { TSnapshotOperations } from "./StopTimeTrackerModal"

type TSnapshotOperationsRemoveModal = Exclude<TSnapshotOperations, "create">

type TIssueSnapshotsList = {
    timeTrackedId: string
    handleSnapshotOperations: TSnapshotOperationsRemoveModal
}

export const SnapshotsList: FC<TIssueSnapshotsList> = observer((props) => {
    const { timeTrackedId, handleSnapshotOperations } = props
    const { getSnapshotsByTimeTrackedId } = useTimeTracker()
    const snapshots = getSnapshotsByTimeTrackedId(timeTrackedId)
    if (!snapshots) return <></>
    return (
        <>
            {snapshots?.map((snapshot) => (
                <SnapshotsDetail
                    snapshotId={snapshot.id}
                    key={snapshot.id}
                    handleSnapshotOperations={handleSnapshotOperations}
                />
            ))}
        </>
    )
})

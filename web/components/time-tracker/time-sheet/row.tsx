import { FC } from "react"

import { observer } from "mobx-react-lite"

import { useTimeTracker } from "@hooks/store"

export const TimeLogRow: FC = observer(() => {
    const {} = useTimeTracker()
    return <></>
})

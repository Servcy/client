import React, { useState } from "react"

import { observer } from "mobx-react-lite"

import { EstimateListItem, UpdateEstimateModal } from "@components/estimates/template"

import { IEstimatePointLite } from "@servcy/types"
import { Loader } from "@servcy/ui"

interface Props {
    estimates: {
        name: string
        description: string
        points: IEstimatePointLite[]
    }
    updateEstimates: (estimates: { name: string; description: string; points: IEstimatePointLite[] }) => void
}

export const EstimatesList: React.FC<Props> = observer((props) => {
    const { estimates, updateEstimates } = props
    // states
    const [estimateFormOpen, setEstimateFormOpen] = useState(false)
    const [estimateToUpdate, setEstimateToUpdate] = useState<
        | {
              name: string
              description: string
              points: IEstimatePointLite[]
          }
        | undefined
    >()
    // theme
    const editEstimate = (estimate: { name: string; description: string; points: IEstimatePointLite[] }) => {
        setEstimateToUpdate(estimate)
        setEstimateFormOpen(true)
    }

    return (
        <>
            <UpdateEstimateModal
                isOpen={estimateFormOpen}
                data={estimateToUpdate}
                updateEstimates={updateEstimates}
                handleClose={() => {
                    setEstimateFormOpen(false)
                    setEstimateToUpdate(undefined)
                }}
            />
            {estimates ? (
                <section className="h-full overflow-y-auto bg-custom-background-100">
                    <EstimateListItem estimate={estimates} editEstimate={(estimate) => editEstimate(estimate)} />
                </section>
            ) : (
                <Loader className="mt-5 space-y-5">
                    <Loader.Item height="40px" />
                    <Loader.Item height="40px" />
                    <Loader.Item height="40px" />
                    <Loader.Item height="40px" />
                </Loader>
            )}
        </>
    )
})

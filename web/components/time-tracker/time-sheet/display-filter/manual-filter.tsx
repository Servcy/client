import React from "react"

import { observer } from "mobx-react-lite"

import { FilterHeader, FilterOption } from "@components/issues"

type TFilterManualTrackedType = {
    is_manually_added: boolean | undefined
    handleUpdate: (val?: boolean) => void
}

export const FilterManualTrackedType: React.FC<TFilterManualTrackedType> = observer((props) => {
    const { is_manually_added, handleUpdate } = props

    const [previewEnabled, setPreviewEnabled] = React.useState(true)

    const activeType = is_manually_added ?? null

    return (
        <>
            <FilterHeader
                title="Manual Or Tracked"
                isPreviewEnabled={previewEnabled}
                handleIsPreviewEnabled={() => setPreviewEnabled(!previewEnabled)}
            />
            {previewEnabled && (
                <div>
                    <FilterOption
                        isChecked={activeType === undefined ? true : false}
                        onClick={() => handleUpdate(undefined)}
                        title={"All"}
                        multiple={false}
                    />
                    <FilterOption
                        isChecked={activeType === true ? true : false}
                        onClick={() => handleUpdate(true)}
                        title={"Manual"}
                        multiple={false}
                    />
                    <FilterOption
                        isChecked={activeType === false ? true : false}
                        onClick={() => handleUpdate(false)}
                        title={"Tracked"}
                        multiple={false}
                    />
                </div>
            )}
        </>
    )
})

import { ReactNode } from "react"

import { observer } from "mobx-react-lite"

import { ITimesheetDisplayPropertyOptions } from "@servcy/types"

interface IWithDisplayPropertiesHOC {
    displayProperties: ITimesheetDisplayPropertyOptions
    displayPropertyKey: keyof ITimesheetDisplayPropertyOptions | (keyof ITimesheetDisplayPropertyOptions)[]
    children: ReactNode
}

export const WithDisplayPropertiesHOC = observer(
    ({ displayProperties, displayPropertyKey, children }: IWithDisplayPropertiesHOC) => {
        let shouldDisplayPropertyFromFilters = false
        if (Array.isArray(displayPropertyKey))
            shouldDisplayPropertyFromFilters = displayPropertyKey.every((key) => !!displayProperties[key])
        else shouldDisplayPropertyFromFilters = !!displayProperties[displayPropertyKey]
        if (!shouldDisplayPropertyFromFilters) return null
        return <>{children}</>
    }
)

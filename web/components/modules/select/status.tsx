import React from "react"

// react hook form
import { Control, Controller, FieldError } from "react-hook-form"

import { MODULE_STATUS } from "@constants/module"

import type { IModule } from "@servcy/types"
import { CustomSelect, DoubleCircleIcon, ModuleStatusIcon } from "@servcy/ui"

type Props = {
    control: Control<IModule, any>
    error?: FieldError
    tabIndex?: number
}

export const ModuleStatusSelect: React.FC<Props> = ({ control, error, tabIndex }) => (
    <Controller
        control={control}
        rules={{ required: true }}
        name="status"
        render={({ field: { value, onChange } }) => (
            <CustomSelect
                value={value}
                label={
                    <div className={`flex items-center justify-center gap-2 text-xs ${error ? "text-red-500" : ""}`}>
                        {value ? (
                            <ModuleStatusIcon status={value} />
                        ) : (
                            <DoubleCircleIcon
                                className={`h-3 w-3 ${error ? "text-red-500" : "text-custom-text-200"}`}
                            />
                        )}
                        {MODULE_STATUS.find((s) => s.value === value)?.label ?? (
                            <span className={`${error ? "text-red-500" : "text-custom-text-200"}`}>Status</span>
                        )}
                    </div>
                }
                onChange={onChange}
                tabIndex={tabIndex}
                noChevron
            >
                {MODULE_STATUS.map((status) => (
                    <CustomSelect.Option key={status.value} value={status.value}>
                        <div className="flex items-center gap-2">
                            <ModuleStatusIcon status={status.value} />
                            {status.label}
                        </div>
                    </CustomSelect.Option>
                ))}
            </CustomSelect>
        )}
    />
)

import { useRouter } from "next/navigation"

import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"

import { observer } from "mobx-react-lite"
import { Controller, useForm } from "react-hook-form"
import toast from "react-hot-toast"

import { useEventTracker, useWorkspace } from "@hooks/store"

import { WORKSPACE_CREATED } from "@constants/event-tracker"
import { RESTRICTED_URLS } from "@constants/workspace"

import { WorkspaceService } from "@services/workspace.service"

import { IWorkspace } from "@servcy/types"
import { Button, Input } from "@servcy/ui"

type Props = {
    onSubmit?: (res: IWorkspace) => Promise<void>
    defaultValues: {
        name: string
        slug: string
    }
    setDefaultValues: Dispatch<SetStateAction<any>>
    secondaryButton?: React.ReactNode
    primaryButtonText?: {
        loading: string
        default: string
    }
}

const workspaceService = new WorkspaceService()

export const CreateWorkspaceForm: FC<Props> = observer((props) => {
    const {
        onSubmit,
        defaultValues,
        setDefaultValues,
        secondaryButton,
        primaryButtonText = {
            loading: "Creating...",
            default: "Create Workspace",
        },
    } = props
    // states
    const [slugError, setSlugError] = useState(false)
    const [invalidSlug, setInvalidSlug] = useState(false)

    const router = useRouter()
    // store hooks
    const { captureWorkspaceEvent } = useEventTracker()
    const { createWorkspace } = useWorkspace()

    // form info
    const {
        handleSubmit,
        control,
        setValue,
        getValues,
        formState: { errors, isSubmitting, isValid },
    } = useForm<IWorkspace>({ defaultValues, mode: "onChange" })

    const handleCreateWorkspace = async (formData: IWorkspace) => {
        await workspaceService
            .workspaceSlugCheck(formData.slug)
            .then(async (res) => {
                if (res.status === true && !RESTRICTED_URLS.includes(formData.slug)) {
                    setSlugError(false)

                    await createWorkspace(formData)
                        .then(async (res) => {
                            captureWorkspaceEvent({
                                eventName: WORKSPACE_CREATED,
                                payload: {
                                    ...res,
                                    state: "SUCCESS",
                                    element: "Create workspace page",
                                },
                            })
                            toast.success("Workspace created successfully.")

                            if (onSubmit) await onSubmit(res)
                        })
                        .catch(() => {
                            captureWorkspaceEvent({
                                eventName: WORKSPACE_CREATED,
                                payload: {
                                    state: "FAILED",
                                    element: "Create workspace page",
                                },
                            })
                            toast.error("Workspace could not be created. Please try again.")
                        })
                } else setSlugError(true)
            })
            .catch(() => {
                toast.error("Some error occurred while creating workspace. Please try again.")
            })
    }

    useEffect(
        () => () => {
            // when the component unmounts set the default values to whatever user typed in
            setDefaultValues(getValues())
        },
        [getValues, setDefaultValues]
    )

    return (
        <form className="space-y-6 sm:space-y-9" onSubmit={handleSubmit(handleCreateWorkspace)}>
            <div className="space-y-6 sm:space-y-7">
                <div className="space-y-1 text-sm">
                    <label htmlFor="workspaceName">Workspace Name</label>
                    <Controller
                        control={control}
                        name="name"
                        rules={{
                            required: "Workspace name is required",
                            validate: (value) =>
                                /^[\w\s-]*$/.test(value) ||
                                `Name can only contain (" "), ( - ), ( _ ) & alphanumeric characters.`,
                            maxLength: {
                                value: 80,
                                message: "Workspace name should not exceed 80 characters",
                            },
                        }}
                        render={({ field: { value, ref, onChange } }) => (
                            <Input
                                id="workspaceName"
                                type="text"
                                value={value}
                                onChange={(e) => {
                                    onChange(e.target.value)
                                    setValue("name", e.target.value)
                                    setValue("slug", e.target.value.toLocaleLowerCase().trim().replace(/ /g, "-"))
                                }}
                                ref={ref}
                                hasError={Boolean(errors.name)}
                                placeholder="Enter workspace name..."
                                className="w-full"
                            />
                        )}
                    />
                </div>
                <div className="space-y-1 text-sm">
                    <label htmlFor="workspaceUrl">Workspace URL</label>
                    <div className="flex w-full items-center rounded-md border-[0.5px] border-custom-border-200 px-3">
                        <span className="whitespace-nowrap text-sm text-custom-text-200">
                            {window && window.location.host}/
                        </span>
                        <Controller
                            control={control}
                            name="slug"
                            rules={{
                                required: "Workspace URL is required",
                            }}
                            render={({ field: { onChange, value, ref } }) => (
                                <Input
                                    id="workspaceUrl"
                                    type="text"
                                    value={value.toLocaleLowerCase().trim().replace(/ /g, "-")}
                                    onChange={(e) => {
                                        ;/^[a-zA-Z0-9_-]+$/.test(e.target.value)
                                            ? setInvalidSlug(false)
                                            : setInvalidSlug(true)
                                        onChange(e.target.value.toLowerCase())
                                    }}
                                    ref={ref}
                                    hasError={Boolean(errors.slug)}
                                    placeholder="Enter workspace url..."
                                    className="block w-full rounded-md border-none bg-transparent !px-0 py-2 text-sm"
                                />
                            )}
                        />
                    </div>
                    {slugError && <span className="-mt-3 text-sm text-red-500">Workspace URL is already taken!</span>}
                    {invalidSlug && (
                        <span className="text-sm text-red-500">{`URL can only contain ( - ), ( _ ) & alphanumeric characters.`}</span>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4">
                {secondaryButton}
                <Button variant="primary" type="submit" size="md" disabled={!isValid} loading={isSubmitting}>
                    {isSubmitting ? primaryButtonText.loading : primaryButtonText.default}
                </Button>
                {!secondaryButton && (
                    <Button variant="neutral-primary" type="button" size="md" onClick={() => router.back()}>
                        Go back
                    </Button>
                )}
            </div>
        </form>
    )
})

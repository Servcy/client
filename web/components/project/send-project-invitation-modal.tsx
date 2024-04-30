import { useParams } from "next/navigation"

import React, { ChangeEvent, useEffect } from "react"

import { Dialog, Transition } from "@headlessui/react"
import { Briefcase, ChevronDown, Plus, Timer, X } from "lucide-react"
import { observer } from "mobx-react-lite"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import toast from "react-hot-toast"

import { useEventTracker, useMember, useUser } from "@hooks/store"

import { CURRENCY_CODES } from "@constants/billing"
import { PROJECT_MEMBER_ADDED } from "@constants/event-tracker"
import { ERoles, ROLES } from "@constants/iam"

import { Avatar, Button, CustomSearchSelect, CustomSelect, Input } from "@servcy/ui"

type Props = {
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
}

type member = {
    role: ERoles
    member_id: string
    rate: string
    currency: string
    per_hour_or_per_project: boolean // true for per hour, false for per project
}

type FormValues = {
    members: member[]
}

const defaultValues: FormValues = {
    members: [
        {
            role: ERoles.MEMBER,
            member_id: "",
            rate: "",
            currency: "USD",
            per_hour_or_per_project: true,
        },
    ],
}

export const SendProjectInvitationModal: React.FC<Props> = observer((props) => {
    const { isOpen, onClose, onSuccess } = props
    const { workspaceSlug, projectId } = useParams()

    // store hooks
    const { captureEvent } = useEventTracker()
    const {
        membership: { currentProjectRole, currentWorkspaceRole },
    } = useUser()
    const {
        project: { projectMemberIds, bulkAddMembersToProject },
        workspace: { workspaceMemberIds, getWorkspaceMemberDetails },
    } = useMember()
    // form info
    const {
        formState: { errors, isSubmitting },
        reset,
        handleSubmit,
        control,
    } = useForm<FormValues>()

    const { fields, append, remove } = useFieldArray({
        control,
        name: "members",
    })

    const uninvitedPeople = workspaceMemberIds?.filter((userId) => {
        const isInvited = projectMemberIds?.find((u) => u === userId)

        return !isInvited
    })

    const onSubmit = async (formData: FormValues) => {
        if (!workspaceSlug || !projectId || isSubmitting) return

        const payload = { ...formData }

        await bulkAddMembersToProject(workspaceSlug.toString(), projectId.toString(), payload)
            .then(() => {
                if (onSuccess) onSuccess()
                onClose()
                captureEvent(PROJECT_MEMBER_ADDED, {
                    members: [
                        ...payload.members.map((member) => ({
                            member_id: member.member_id,
                            role: ROLES[member.role],
                        })),
                    ],
                    state: "SUCCESS",
                    element: "Project settings members page",
                })
            })
            .catch(() => {
                captureEvent(PROJECT_MEMBER_ADDED, {
                    state: "FAILED",
                    element: "Project settings members page",
                })
            })
            .finally(() => {
                reset(defaultValues)
            })
    }
    const handleClose = () => {
        onClose()

        const timeout = setTimeout(() => {
            reset(defaultValues)
            clearTimeout(timeout)
        }, 500)
    }
    const appendField = () => {
        if (fields.length >= 10) return toast.error("Only 10 invites are allowed at a time")
        append({
            role: ERoles.MEMBER,
            member_id: "",
            rate: "",
            currency: "USD",
            per_hour_or_per_project: true,
        })
    }
    const handleRateChange = (onChange: any) => (e: ChangeEvent<HTMLInputElement>) => {
        if (Number.isNaN(Number(e.target.value))) return
        onChange(e.target.value)
    }
    useEffect(() => {
        if (fields.length === 0) {
            append([
                {
                    role: ERoles.MEMBER,
                    member_id: "",
                    rate: "",
                    currency: "USD",
                    per_hour_or_per_project: true,
                },
            ])
        }
    }, [fields, append])

    const options = uninvitedPeople?.map((userId) => {
        const memberDetails = getWorkspaceMemberDetails(userId)

        return {
            value: `${memberDetails?.member.id}`,
            query: `${memberDetails?.member.first_name} ${
                memberDetails?.member.last_name
            } ${memberDetails?.member.display_name.toLowerCase()}`,
            content: (
                <div className="flex w-full items-center gap-2">
                    <div className="flex-shrink-0 pt-0.5">
                        <Avatar name={memberDetails?.member.display_name} src={memberDetails?.member.avatar} />
                    </div>
                    <div className="truncate">
                        {memberDetails?.member.display_name} (
                        {memberDetails?.member.first_name + " " + memberDetails?.member.last_name})
                    </div>
                </div>
            ),
        }
    })

    return (
        <Transition.Root show={isOpen} as={React.Fragment}>
            <Dialog as="div" className="relative z-20" onClose={handleClose}>
                <Transition.Child
                    as={React.Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-custom-backdrop transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-20 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform rounded-lg bg-custom-background-100 p-5 text-left shadow-custom-shadow-md transition-all sm:w-full lg:max-w-5xl max-w-2xl">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="space-y-5">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-custom-text-100"
                                        >
                                            Invite Members
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p className="text-sm text-custom-text-200">
                                                Invite members to work on your project.
                                            </p>
                                        </div>

                                        <div className="mb-3 space-y-4">
                                            {fields.map((field, index) => (
                                                <div
                                                    key={field.id}
                                                    className="group mb-1 lg:grid lg:grid-cols-12 items-start gap-x-4 text-sm flex-wrap flex"
                                                >
                                                    <div className="lg:col-span-7 lg:flex lg:flex-col gap-1 max-lg:w-full">
                                                        <Controller
                                                            control={control}
                                                            name={`members.${index}.member_id`}
                                                            rules={{ required: "Please select a member" }}
                                                            render={({ field: { value, onChange } }) => {
                                                                const selectedMember = getWorkspaceMemberDetails(value)

                                                                return (
                                                                    <CustomSearchSelect
                                                                        value={value}
                                                                        customButton={
                                                                            <button className="flex w-full items-center justify-between gap-1 rounded-md border border-custom-border-200 px-3 py-2 text-left text-sm text-custom-text-200 shadow-sm duration-300 hover:bg-custom-background-80 hover:text-custom-text-100 focus:outline-none">
                                                                                {value && value !== "" ? (
                                                                                    <div className="flex items-center gap-2">
                                                                                        <Avatar
                                                                                            name={
                                                                                                selectedMember?.member
                                                                                                    .display_name
                                                                                            }
                                                                                            src={
                                                                                                selectedMember?.member
                                                                                                    .avatar
                                                                                            }
                                                                                        />
                                                                                        {
                                                                                            selectedMember?.member
                                                                                                .display_name
                                                                                        }
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="flex items-center gap-2 py-0.5">
                                                                                        Select co-worker
                                                                                    </div>
                                                                                )}
                                                                                <ChevronDown
                                                                                    className="h-3 w-3"
                                                                                    aria-hidden="true"
                                                                                />
                                                                            </button>
                                                                        }
                                                                        onChange={(val: string) => {
                                                                            onChange(val)
                                                                        }}
                                                                        options={options}
                                                                        optionsClassName="w-full"
                                                                    />
                                                                )
                                                            }}
                                                        />
                                                        {errors.members && errors.members[index]?.member_id && (
                                                            <span className="px-1 text-sm text-red-500">
                                                                {errors.members[index]?.member_id?.message}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="lg:col-span-5 flex items-center justify-between gap-2 max-lg:w-full max-lg:mt-1">
                                                        <div className="flex flex-col gap-1">
                                                            <Controller
                                                                name={`members.${index}.role`}
                                                                control={control}
                                                                rules={{ required: "Select Role" }}
                                                                render={({ field }) => (
                                                                    <CustomSelect
                                                                        {...field}
                                                                        customButton={
                                                                            <div className="flex w-full items-center justify-between gap-1 rounded-md border border-custom-border-200 px-3 py-2.5 text-left text-sm text-custom-text-200 shadow-sm duration-300 hover:bg-custom-background-80 hover:text-custom-text-100 focus:outline-none">
                                                                                <span className="capitalize">
                                                                                    {field.value
                                                                                        ? ROLES[field.value]
                                                                                        : "Select role"}
                                                                                </span>
                                                                                <ChevronDown
                                                                                    className="h-3 w-3"
                                                                                    aria-hidden="true"
                                                                                />
                                                                            </div>
                                                                        }
                                                                        input
                                                                        optionsClassName="w-full"
                                                                    >
                                                                        {Object.entries(ROLES).map(([key, label]) => {
                                                                            if (
                                                                                parseInt(key) >
                                                                                (currentProjectRole ?? ERoles.GUEST)
                                                                            )
                                                                                return null

                                                                            return (
                                                                                <CustomSelect.Option
                                                                                    key={key}
                                                                                    value={key}
                                                                                >
                                                                                    {label}
                                                                                </CustomSelect.Option>
                                                                            )
                                                                        })}
                                                                    </CustomSelect>
                                                                )}
                                                            />
                                                            {errors.members && errors.members[index]?.role && (
                                                                <span className="px-1 text-sm text-red-500">
                                                                    {errors.members[index]?.role?.message}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {currentWorkspaceRole === ERoles.ADMIN && (
                                                            <div className="relative flex w-full flex-col gap-1">
                                                                <Controller
                                                                    name={`members.${index}.rate`}
                                                                    control={control}
                                                                    render={({ field: { value, onChange } }) => (
                                                                        <Input
                                                                            id={`members.${index}.rate`}
                                                                            name={`members.${index}.rate`}
                                                                            type="text"
                                                                            value={value}
                                                                            onChange={handleRateChange(onChange)}
                                                                            hasError={Boolean(
                                                                                errors.members &&
                                                                                    errors.members[index]?.rate
                                                                            )}
                                                                            placeholder="Member cost..."
                                                                            className="focus:border-green-300"
                                                                        />
                                                                    )}
                                                                />
                                                                {errors.members && errors.members[index]?.rate && (
                                                                    <span className="px-1 text-sm text-red-500">
                                                                        {errors.members[index]?.rate?.message}
                                                                    </span>
                                                                )}
                                                                <div className="absolute right-0 w-14">
                                                                    <Controller
                                                                        name={`members.${index}.currency`}
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <CustomSelect
                                                                                {...field}
                                                                                label={
                                                                                    <div className="flex items-center gap-1">
                                                                                        {field.value ?? "USD"}
                                                                                    </div>
                                                                                }
                                                                                placement="bottom-start"
                                                                                noChevron
                                                                                input
                                                                                optionsClassName="w-full"
                                                                            >
                                                                                {CURRENCY_CODES.map((currency) => (
                                                                                    <CustomSelect.Option
                                                                                        key={currency.code}
                                                                                        value={currency.code}
                                                                                    >
                                                                                        <div className="flex items-center gap-2">
                                                                                            <currency.icon className="h-3.5 w-3.5" />
                                                                                            <div>{currency.code}</div>
                                                                                        </div>
                                                                                    </CustomSelect.Option>
                                                                                ))}
                                                                            </CustomSelect>
                                                                        )}
                                                                    />
                                                                    {errors.members &&
                                                                        errors.members[index]?.currency && (
                                                                            <span className="px-1 text-sm text-red-500">
                                                                                {
                                                                                    errors.members[index]?.currency
                                                                                        ?.message
                                                                                }
                                                                            </span>
                                                                        )}
                                                                </div>
                                                                <div className="absolute right-[56px]">
                                                                    <Controller
                                                                        name={`members.${index}.per_hour_or_per_project`}
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <CustomSelect
                                                                                {...field}
                                                                                label={
                                                                                    <div className="flex items-center gap-1">
                                                                                        {field.value ? (
                                                                                            <Timer className="h-3 w-3" />
                                                                                        ) : (
                                                                                            <Briefcase className="h-3 w-3" />
                                                                                        )}
                                                                                        {field.value
                                                                                            ? "Per Hour"
                                                                                            : "For Project"}
                                                                                    </div>
                                                                                }
                                                                                placement="bottom-start"
                                                                                noChevron
                                                                                input
                                                                            >
                                                                                <CustomSelect.Option value={true}>
                                                                                    <div className="flex items-center gap-2">
                                                                                        <Timer className="h-3.5 w-3.5" />
                                                                                        <div>Per Hour</div>
                                                                                    </div>
                                                                                </CustomSelect.Option>
                                                                                <CustomSelect.Option value={false}>
                                                                                    <div className="flex items-center gap-2">
                                                                                        <Briefcase className="h-3.5 w-3.5" />
                                                                                        <div>For Project</div>
                                                                                    </div>
                                                                                </CustomSelect.Option>
                                                                            </CustomSelect>
                                                                        )}
                                                                    />
                                                                    {errors.members &&
                                                                        errors.members[index]
                                                                            ?.per_hour_or_per_project && (
                                                                            <span className="px-1 text-sm text-red-500">
                                                                                {
                                                                                    errors.members[index]
                                                                                        ?.per_hour_or_per_project
                                                                                        ?.message
                                                                                }
                                                                            </span>
                                                                        )}
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className="flex-item flex w-6">
                                                            {fields.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    className="place-items-center self-center rounded"
                                                                    onClick={() => remove(index)}
                                                                >
                                                                    <X className="h-4 w-4 text-custom-text-200" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-5 flex items-center justify-between gap-2">
                                        <button
                                            type="button"
                                            className="flex items-center gap-2 bg-transparent py-2 pr-3 text-sm font-medium text-custom-primary outline-custom-primary"
                                            onClick={appendField}
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add more
                                        </button>
                                        <div className="flex items-center gap-2">
                                            <Button variant="neutral-primary" size="sm" onClick={handleClose}>
                                                Cancel
                                            </Button>
                                            <Button variant="primary" size="sm" type="submit" loading={isSubmitting}>
                                                {isSubmitting
                                                    ? `${
                                                          fields && fields.length > 1
                                                              ? "Adding Members..."
                                                              : "Adding Member..."
                                                      }`
                                                    : `${fields && fields.length > 1 ? "Add Members" : "Add Member"}`}
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
})

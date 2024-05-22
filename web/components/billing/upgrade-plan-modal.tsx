"use client"

import Image from "next/image"
import { useParams } from "next/navigation"

import React, { FC } from "react"

import { Dialog, Transition } from "@headlessui/react"
import { BadgeCheckIcon, ShieldCheck } from "lucide-react"

import { useBilling } from "@hooks/store"

import { plans } from "@constants/billing"

import { Button, TButtonVariant } from "@servcy/ui"

type Props = {
    onClose: () => void
    isOpen: boolean
}

export const UpgradePlanModal: FC<Props> = (props) => {
    const { isOpen, onClose } = props
    const { workspaceSlug } = useParams()
    const { cancelSubscription, currentWorkspaceSubscription } = useBilling()
    if (!workspaceSlug) return null
    return (
        <Transition.Root show={isOpen} as={React.Fragment}>
            <Dialog as="div" className="relative z-20" onClose={onClose}>
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
                    <div className="my-10 flex justify-center p-4 text-center sm:p-0 md:my-20">
                        <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform rounded-lg bg-custom-background-100 p-5 px-4 text-left shadow-custom-shadow-md transition-all w-full sm:max-w-2xl min-w-[70vw]">
                                <div className="border border-custom-border-100 bg-custom-background-200 rounded p-8">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {Object.values(plans).map((plan, index) => (
                                            <div
                                                className="col-span-1 border border-custom-border-200 bg-custom-background-300 rounded p-8"
                                                key={plan.name}
                                            >
                                                <div className="font-axiforma mb-4 flex h-20 items-center pb-4 text-lg font-extrabold text-custom-servcy-wheat md:text-xl">
                                                    <Image
                                                        src={plan.icon}
                                                        alt={plan.name}
                                                        className="mr-4"
                                                        width="48"
                                                        height="48"
                                                    />
                                                    <div>
                                                        <span className="text-custom-servcy-wheat">{plan.name}</span>
                                                        <div className="text-sm text-custom-text-100">
                                                            {plan.description}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-6 h-16 border-b-2 border-neutral-500 pb-4">
                                                    {plan.usdPrice && plan.inrPrice ? (
                                                        <>
                                                            <span className="text-3xl font-extrabold text-custom-servcy-wheat">
                                                                $
                                                            </span>
                                                            <span className="ml-1 text-3xl font-extrabold text-custom-servcy-wheat">
                                                                {plan.usdPrice}
                                                            </span>
                                                            <span className="text-xl font-extrabold text-custom-servcy-silver">
                                                                /mo
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-stone-400 text-sm">
                                                            Get a custom demo and see how Servcy aligns with your goals.
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="mb-4">
                                                    <Button
                                                        className="flex p-4 w-full items-center justify-center rounded-lg text-lg font-extrabold"
                                                        size="sm"
                                                        disabled={
                                                            currentWorkspaceSubscription?.plan_details.name ===
                                                                plan.name ||
                                                            index <
                                                                Object.values(plans).findIndex(
                                                                    (p) =>
                                                                        currentWorkspaceSubscription?.plan_details
                                                                            .name === p.name
                                                                )
                                                        }
                                                        onClick={() => {
                                                            window.open(
                                                                "https://calendly.com/servcy/demo",
                                                                "_blank",
                                                                "noopener,noreferrer"
                                                            )
                                                        }}
                                                        variant={plan.buttonVariant as TButtonVariant}
                                                    >
                                                        <plan.buttonIcon className="mr-2" size="24" />
                                                        <span className="truncate">
                                                            {currentWorkspaceSubscription?.plan_details.name ===
                                                            plan.name
                                                                ? "Current Plan"
                                                                : `Upgrade To ${plan.name}`}
                                                        </span>
                                                    </Button>
                                                </div>
                                                <div className="h-4 flex justify-end">
                                                    {currentWorkspaceSubscription?.plan_details.name === plan.name && (
                                                        <Button
                                                            variant="link-danger"
                                                            className="p-0"
                                                            size="sm"
                                                            onClick={() => cancelSubscription(workspaceSlug.toString())}
                                                        >
                                                            <span className="underline">cancel subscription</span>
                                                        </Button>
                                                    )}
                                                </div>
                                                {plan.addedBenefits && (
                                                    <div className="my-2 flex text-sm items-center">
                                                        <ShieldCheck className="mr-2 size-4 text-custom-text-100" />
                                                        <span className="text-custom-text-100 truncate">
                                                            {plan.addedBenefits}
                                                        </span>
                                                    </div>
                                                )}
                                                {plan.offerings.map((offer) => (
                                                    <div className="my-2 flex text-sm items-center" key={offer}>
                                                        <BadgeCheckIcon className="mr-2 size-4 text-custom-text-100" />
                                                        <span className="text-custom-text-100 truncate">{offer}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

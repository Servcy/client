"use client"

import { useRouter } from "next/navigation.js"

import { useEffect } from "react"

import { AiOutlineHome, AiOutlineRightCircle, AiOutlineRocket } from "react-icons/ai"

import UserAuthWrapper from "@wrappers/UserAuthWrapper"

import { Button } from "@servcy/ui"

const activationSteps = [
    {
        title: "Integrate Your Apps",
        description: "Integrate workspaces like GitHub, Slack, Google, Notion, Figma, Linear, Jira, Trello etc.",
        cta: "Integrate",
        href: "/integrations",
    },
]

export default function Index(): JSX.Element {
    const router = useRouter()

    const requestNotificationPermission = async () => {
        if (!("Notification" in window) || Notification.permission === "granted") return
        await Notification.requestPermission()
    }

    useEffect(() => {
        requestNotificationPermission()
    }, [])

    return (
        <UserAuthWrapper>
            <main className="order-2 h-screen flex-[1_0_16rem] overflow-y-scroll bg-servcy-gray p-3 text-servcy-black">
                <header className="mb-6 h-[80px] rounded-lg bg-custom-background-100 p-6">
                    <div className="flex flex-row">
                        <AiOutlineHome size="24" className="my-auto mr-2" />
                        <p className="text-xl">Dashboard</p>
                    </div>
                </header>
                <div className="mb-6 min-h-[80px] rounded-lg bg-custom-background-100 p-6 text-lg">
                    <div className="mb-4 flex flex-row">
                        <AiOutlineRocket size="24" className="my-auto mr-2" />
                        Start Your Journey
                    </div>
                    <div className="grid gap-8 lg:grid-cols-3">
                        {activationSteps.map((step, index) => (
                            <div
                                key={index}
                                className="rounded-lg bg-custom-background-90 border-[0.5px] border-custom-border-200 hover:shadow-custom-shadow-4xl duration-300 p-4"
                            >
                                <div className="mb-4 h-24">
                                    <h5 className="mb-3 font-semibold tracking-tight text-servcy-wheat">
                                        {step.title}
                                    </h5>
                                    <p className="text-sm font-normal">{step.description}</p>
                                </div>
                                <div className="mt-2 flex flex-row justify-between">
                                    <Button
                                        onClick={() => {
                                            step.href && router.push(step.href)
                                        }}
                                        variant="outline-primary"
                                    >
                                        <AiOutlineRightCircle /> {step.cta}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </UserAuthWrapper>
    )
}

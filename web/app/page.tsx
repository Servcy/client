"use client"

import { useEffect } from "react"

import { observer } from "mobx-react"
import { useRouter } from "next-nprogress-bar"
import { AiOutlineRightCircle, AiOutlineRocket } from "react-icons/ai"

import DefaultWrapper from "@wrappers/DefaultWrapper"

import { NextPageWithWrapper } from "@servcy/types"
import { Button } from "@servcy/ui"

const activationSteps = [
    {
        title: "Integrate Your Apps",
        description: "Integrate workspaces like GitHub, Slack, Google, Notion, Figma, Linear, Jira, Trello etc.",
        cta: "Integrate",
        href: "/integrations",
    },
    {
        title: "Create A Workspace",
        description: "Create a workspace for your team and invite members to collaborate.",
        cta: "Create",
        href: "/workspace/create",
    },
    {
        title: "Manage Your Inbox",
        description: "Manage your inbox and keep track of your tasks, issues, and pull requests.",
        cta: "Manage",
        href: "/inbox",
    },
]

const Home: NextPageWithWrapper = observer(() => {
    const router = useRouter()

    const requestNotificationPermission = async () => {
        if (!("Notification" in window) || Notification.permission === "granted") return
        await Notification.requestPermission()
    }

    useEffect(() => {
        requestNotificationPermission()
    }, [])

    return (
        <DefaultWrapper>
            <main className="h-screen flex-[1_0_16rem] overflow-y-scroll p-3">
                <div className="mb-6 min-h-[80px] rounded-lg bg-custom-background-100 p-6 text-lg border-custom-border-200 border-[0.5px]">
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
        </DefaultWrapper>
    )
})

export default Home

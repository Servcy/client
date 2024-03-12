import { useEffect, useState } from "react"

import { Card, Checkbox, Modal } from "antd"

import FigmaConfiguration from "@components/integrations/FigmaConfiguration"
import GithubConfiguration from "@components/integrations/GithubConfiguration"
import GoogleConfiguration from "@components/integrations/GoogleConfiguration"
import MicrosoftConfiguration from "@components/integrations/MicrosoftConfiguration"

import IntegrationService from "@services/integration.service"

import type { Integration, IntegrationEvent, UserIntegration } from "@servcy/types"

const integrationService = new IntegrationService()

export default function IntegrationConfigurationModal({
    selectedIntegration,
    onClose,
}: {
    selectedIntegration: Integration
    onClose: () => void
}) {
    const [loading, setLoading] = useState<boolean>(false)
    const [events, setEvents] = useState<IntegrationEvent[]>([])
    const [userIntegrations, setUserIntegrations] = useState<UserIntegration[]>([])

    useEffect(() => {
        setLoading(true)
        integrationService
            .fetchUserIntegrations(selectedIntegration.name)
            .then((response) => {
                setUserIntegrations(response)
            })
            .catch((error) => {
                console.error("Error fetching user integrations", error)
            })
        integrationService
            .fetchIntegrationEvents(String(selectedIntegration.id))
            .then((events) => {
                setEvents(JSON.parse(events))
            })
            .finally(() => {
                setTimeout(() => {
                    setLoading(false)
                }, 1000)
            })
    }, [selectedIntegration.id, selectedIntegration.name])

    const handleEnableEvent = (event: IntegrationEvent) => {
        integrationService
            .enableIntegrationEvent({
                integration_id: selectedIntegration.id,
                event_id: event.id,
            })
            .then(() => {
                setEvents((events) =>
                    events.map((e) => {
                        if (e.id === event.id) {
                            return {
                                ...e,
                                is_disabled: false,
                            }
                        }
                        return e
                    })
                )
            })
    }

    const handleDisableEvent = (event: IntegrationEvent) => {
        integrationService
            .disableIntegrationEvent({
                integration_id: selectedIntegration.id,
                event_id: event.id,
            })
            .then(() => {
                setEvents((events) =>
                    events.map((e) => {
                        if (e.id === event.id) {
                            return {
                                ...e,
                                is_disabled: true,
                            }
                        }
                        return e
                    })
                )
            })
    }

    return (
        <Modal
            open={true}
            title={`${selectedIntegration.name} Configuration`}
            onCancel={onClose}
            footer={false}
            width="60vw"
        >
            <Card
                className="mt-4 rounded-lg bg-custom-background-90 border-[0.5px] border-custom-border-200"
                title={<div className="text-custom-text-200">Integrated Accounts</div>}
                loading={loading}
            >
                <div className="grid max-h-[400px] grid-cols-2 gap-2 overflow-auto text-custom-text-200">
                    {userIntegrations.length > 0 ? (
                        userIntegrations.map((userIntegration) => (
                            <div
                                key={userIntegration.id}
                                className="bg-custom-background-80 flex items-center justify-between rounded-lg p-4 font-semibold"
                            >
                                <div className="truncate">{userIntegration.account_display_name}</div>
                                <button
                                    className="ml-4 cursor-not-allowed rounded p-2 bg-custom-servcy-gray text-custom-text-300"
                                    disabled
                                >
                                    Disconnect
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-left text-custom-text-200">No accounts connected</div>
                    )}
                </div>
            </Card>
            {events.length > 0 && (
                <Card
                    className="mt-4 min-h-[200px] rounded-lg bg-custom-background-90 border-[0.5px] border-custom-border-200"
                    title={
                        <div className="flex justify-between text-custom-text-200">
                            <p>Events</p>
                            <p>Enable/Disable</p>
                        </div>
                    }
                    loading={loading}
                >
                    <div className="grid max-h-[400px] grid-cols-2 gap-2 overflow-auto">
                        {events.map((event) => (
                            <div key={event.id} className="flex flex-row">
                                <Checkbox
                                    className="mr-2"
                                    checked={!event.is_disabled}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            handleEnableEvent(event)
                                        } else {
                                            handleDisableEvent(event)
                                        }
                                    }}
                                />
                                <div className="flex flex-col text-custom-text-300">
                                    <p className="font-bold">{event.name}</p>
                                    <p className="text-sm">{event.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
            {["Github", "Figma", "Gmail", "Outlook"].includes(selectedIntegration.name) && (
                <Card
                    className="mt-4 rounded-lg bg-custom-background-90 border-[0.5px] border-custom-border-200"
                    title={<div className="text-custom-text-200">Additional Configuration</div>}
                >
                    {selectedIntegration.name === "Github" && <GithubConfiguration />}
                    {selectedIntegration.name === "Figma" && (
                        <FigmaConfiguration selectedIntegration={selectedIntegration} />
                    )}
                    {selectedIntegration.name === "Gmail" && (
                        <GoogleConfiguration selectedIntegration={selectedIntegration} />
                    )}
                    {selectedIntegration.name === "Outlook" && (
                        <MicrosoftConfiguration selectedIntegration={selectedIntegration} />
                    )}
                </Card>
            )}
        </Modal>
    )
}

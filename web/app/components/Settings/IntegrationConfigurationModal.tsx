import { useEffect, useState } from "react";

import { Integration, IntegrationEvent, UserIntegration } from "@/types/apps/integration";

import { Card, Checkbox, Modal } from "antd";
import FigmaConfiguration from "./FigmaConfiguration";
import GithubConfiguration from "./GithubConfiguration";
import GoogleConfiguration from "./GoogleConfiguration";
import MicrosoftConfiguration from "./MicrosoftConfiguration";

import {
  disableIntegrationEvent,
  enableIntegrationEvent,
  fetchIntegrationEvents,
  fetchUserIntegrations,
} from "@/apis/integration";

export default function IntegrationConfigurationModal({
  selectedIntegration,
  onClose,
}: {
  selectedIntegration: Integration;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [events, setEvents] = useState<IntegrationEvent[]>([]);
  const [userIntegrations, setUserIntegrations] = useState<UserIntegration[]>([]);

  useEffect(() => {
    setLoading(true);
    fetchUserIntegrations(selectedIntegration.name)
      .then((response) => {
        setUserIntegrations(response);
      })
      .catch((error) => {
        console.error("Error fetching user integrations", error);
      });
    fetchIntegrationEvents(String(selectedIntegration.id))
      .then((events) => {
        setEvents(JSON.parse(events));
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      });
  }, [selectedIntegration.id, selectedIntegration.name]);

  const handleEnableEvent = (event: IntegrationEvent) => {
    enableIntegrationEvent({
      integration_id: selectedIntegration.id,
      event_id: event.id,
    }).then(() => {
      setEvents((events) =>
        events.map((e) => {
          if (e.id === event.id) {
            return {
              ...e,
              is_disabled: false,
            };
          }
          return e;
        })
      );
    });
  };

  const handleDisableEvent = (event: IntegrationEvent) => {
    disableIntegrationEvent({
      integration_id: selectedIntegration.id,
      event_id: event.id,
    }).then(() => {
      setEvents((events) =>
        events.map((e) => {
          if (e.id === event.id) {
            return {
              ...e,
              is_disabled: true,
            };
          }
          return e;
        })
      );
    });
  };

  return (
    <Modal
      open={true}
      title={`${selectedIntegration.name} Configuration`}
      onCancel={onClose}
      footer={false}
      width="60vw"
    >
      <Card
        className="mt-4 rounded-lg bg-servcy-black"
        title={<div className="text-servcy-cream">Integrated Accounts</div>}
        loading={loading}
      >
        <div className="grid max-h-[400px] grid-cols-2 gap-2 overflow-auto">
          {userIntegrations.map((userIntegration) => (
            <div
              key={userIntegration.id}
              className="servcy-card-bg flex items-center justify-between rounded-lg p-4 font-semibold text-servcy-black"
            >
              <div className="truncate">{userIntegration.account_display_name}</div>
              <button className="ml-4 cursor-not-allowed rounded bg-servcy-black p-2 text-servcy-wheat" disabled>
                Disconnect
              </button>
            </div>
          ))}
        </div>
      </Card>
      {events.length > 0 && (
        <Card
          className="mt-4 min-h-[200px] rounded-lg bg-servcy-black text-servcy-cream"
          title={
            <div className="flex justify-between">
              <p className="text-servcy-cream">Events</p>
              <p className="text-servcy-wheat">Enable/Disable</p>
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
                      handleEnableEvent(event);
                    } else {
                      handleDisableEvent(event);
                    }
                  }}
                />
                <div className="flex flex-col">
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
          className="mt-4 rounded-lg bg-servcy-black text-servcy-cream"
          title={<div className="text-servcy-cream">Additional Configuration</div>}
        >
          {selectedIntegration.name === "Github" && <GithubConfiguration />}
          {selectedIntegration.name === "Figma" && <FigmaConfiguration selectedIntegration={selectedIntegration} />}
          {selectedIntegration.name === "Gmail" && <GoogleConfiguration selectedIntegration={selectedIntegration} />}
          {selectedIntegration.name === "Outlook" && (
            <MicrosoftConfiguration selectedIntegration={selectedIntegration} />
          )}
        </Card>
      )}
    </Modal>
  );
}

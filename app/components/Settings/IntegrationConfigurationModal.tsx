import { useEffect, useState } from "react";
// Types
import { Integration, IntegrationEvent } from "@/types/integration";
// Components
import { Card, Checkbox, Modal } from "antd";
import FigmaConfiguration from "./FigmaConfiguration";
import GithubConfiguration from "./GithubConfiguration";
// Apis
import {
  disableIntegrationEvent,
  enableIntegrationEvent,
  fetchIntegrationEvents,
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

  useEffect(() => {
    setLoading(true);
    fetchIntegrationEvents(String(selectedIntegration.id))
      .then((events) => {
        setEvents(JSON.parse(events));
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      });
  }, [selectedIntegration.id]);

  const handleEnableEvent = (event: IntegrationEvent) => {
    enableIntegrationEvent({
      integration_id: selectedIntegration.id,
      event_id: event.id,
    }).then(() => {
      setEvents((events) => {
        return events.map((e) => {
          if (e.id === event.id) {
            return {
              ...e,
              is_disabled: false,
            };
          }
          return e;
        });
      });
    });
  };

  const handleDisableEvent = (event: IntegrationEvent) => {
    disableIntegrationEvent({
      integration_id: selectedIntegration.id,
      event_id: event.id,
    }).then(() => {
      setEvents((events) => {
        return events.map((e) => {
          if (e.id === event.id) {
            return {
              ...e,
              is_disabled: true,
            };
          }
          return e;
        });
      });
    });
  };

  return (
    <Modal
      open={true}
      title={`${selectedIntegration.name} Configuration`}
      onCancel={onClose}
      footer={false}
      width="60vw"
      styles={{
        body: {
          overflowY: "scroll",
          overflowX: "hidden",
        },
      }}
    >
      <Card
        className="mt-4 min-h-[200px] rounded-lg"
        title="Events"
        loading={loading}
      >
        <div className="grid max-h-[400px] grid-cols-2 gap-2 overflow-auto">
          {events.length > 0 ? (
            events.map((event) => {
              return (
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
              );
            })
          ) : (
            <div>No events found</div>
          )}
        </div>
      </Card>
      {["Github", "Figma"].includes(selectedIntegration.name) && (
        <Card className="mt-4 rounded-lg" title="Additional Configuration">
          {selectedIntegration.name === "Github" && <GithubConfiguration />}
          {selectedIntegration.name === "Figma" && (
            <FigmaConfiguration selectedIntegration={selectedIntegration} />
          )}
        </Card>
      )}
    </Modal>
  );
}

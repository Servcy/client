import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
// Types
import { Integration } from "@/types/integration";
// Components
import { Button, Card, Checkbox, Input, Modal, Select } from "antd";
import Image from "next/image.js";
import { MdOutlineSyncAlt } from "react-icons/md";
// Apis
import {
  configureUserIntegration as configureUserIntegrationApi,
  disableIntegrationEvent,
  enableIntegrationEvent,
  fetchIntegrationEvents,
  fetchUserIntegrations as fetchUserIntegrationsApi,
} from "@/apis/integration";
interface IntegrationEvent {
  id: number;
  name: string;
  description: string;
  is_disabled: boolean;
}

export interface UserIntegration {
  id: number;
  account_display_name: string;
  account_id: string;
  integration_id: number;
  user_id: number;
  configuration: string;
}
export default function IntegrationConfigurationModal({
  selectedIntegration,
  onClose,
}: {
  selectedIntegration: Integration;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [events, setEvents] = useState<IntegrationEvent[]>([]);
  const [userIntegrationId, setUserIntegrationId] = useState<number>(0);
  const router = useRouter();
  const [saving, setSaving] = useState<boolean>(false);
  const [teamIds, setTeamIds] = useState<Set<string>>(new Set([""]));
  const [userIntegrations, setUserIntegrations] = useState<UserIntegration[]>(
    []
  );

  useEffect(() => {
    setLoading(true);
    setUserIntegrationId(selectedIntegration.id);
    fetchUserIntegrationsApi("Figma")
      .then((response) => {
        setUserIntegrations(response);
        if (response.length === 1) {
          setUserIntegrationId(response[0].id);
          setTeamIds(new Set(response[0].configuration.team_ids));
        }
      })
      .catch((error) => {
        toast.error(error.response.data.detail);
      })
      .finally(() => {
        setLoading(false);
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
  }, [selectedIntegration.id]);

  const configureFigma = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nonEmptyTeamIds = new Set(teamIds);
    nonEmptyTeamIds.delete("");
    if (nonEmptyTeamIds.size === 0) {
      toast.error("Please enter atleast one team ID");
      return;
    }
    setSaving(true);
    configureUserIntegrationApi(
      userIntegrationId,
      {
        team_ids: Array.from(nonEmptyTeamIds),
      },
      "Figma"
    )
      .then(() => {
        toast.success("Figma configured successfully!");
      })
      .catch((error: any) => {
        toast.error(error?.response?.data?.detail || "Something went wrong!");
      })
      .finally(() => {
        setSaving(false);
        router.push("/integrations");
      });
  };

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
      bodyStyle={{
        overflowY: "scroll",
        overflowX: "hidden",
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
      <Card className="mt-4 min-h-[200px] rounded-lg" title="Configuration">
        {selectedIntegration.name === "Github" && (
          <a
            href="https://github.com/apps/servcy/installations/select_target"
            target="_blank"
            rel="noreferrer"
          >
            <button className="rounded-lg bg-servcy-black p-2 text-servcy-wheat">
              Install Servcy on Github
            </button>
          </a>
        )}
        {selectedIntegration.name === "Figma" && (
          <div className="flex min-h-[500px] w-[80%] flex-col rounded-lg border border-servcy-gray bg-servcy-black p-6 text-servcy-white shadow-md md:flex-row">
            <div className="w-full flex-col p-4">
              <div className="flex text-xl font-semibold">
                <Image
                  className="my-auto h-[40px] min-h-[40px] min-w-[40px] max-w-[40px] rounded-lg border border-servcy-gray bg-servcy-white p-1"
                  src="https://servcy-public.s3.amazonaws.com/figma.svg"
                  width={40}
                  height={40}
                  alt="Figma Logo"
                />
                <MdOutlineSyncAlt
                  className="my-auto mx-2"
                  color="grey"
                  size={20}
                />
                <Image
                  className="my-auto mr-5 max-h-[40px] min-h-[40px] min-w-[40px] max-w-[40px] rounded-lg border border-servcy-gray p-1"
                  src="https://servcy-public.s3.amazonaws.com/logo.svg"
                  width={40}
                  height={40}
                  alt="Servcy Logo"
                />
                <div className="my-auto">Figma Integration Setup</div>
              </div>
              {loading ? (
                <div className="mt-8 ml-auto mb-2.5 h-5 animate-pulse rounded-full bg-servcy-white"></div>
              ) : (
                <Select
                  className="mt-8 w-full"
                  id="user_integration_id"
                  placeholder="Select Account"
                  value={userIntegrationId}
                  onChange={(e: any) => {
                    setUserIntegrationId(Number.parseInt(e.target.value));
                  }}
                >
                  {userIntegrations.length === 0 ? (
                    <option value={0} className="capitalize">
                      No accounts found
                    </option>
                  ) : (
                    userIntegrations.map((userIntegration) => (
                      <option
                        key={userIntegration.id}
                        value={userIntegration.id}
                        className="capitalize"
                      >
                        {userIntegration.account_display_name}
                      </option>
                    ))
                  )}
                </Select>
              )}
              <section className="mt-8">
                <span className="font-sans text-lg font-semibold">
                  To find your team IDs follow listed instructions:
                </span>
                <ul className="mt-4 list-inside font-serif text-sm font-light">
                  <li className="mb-4">
                    Login to your figma account in a separate tab
                  </li>
                  <li className="mb-4">
                    Under teams dropdown in your sidebar, you will find all your
                    teams
                  </li>
                  <li className="mb-4">
                    Click on the team you want to integrate with Servcy
                  </li>
                  <li className="mb-4">
                    Copy the team id from the URL in your browser
                  </li>
                  <li>
                    For example if the URL is{" "}
                    <span className="rounded-lg bg-servcy-white p-1 font-semibold text-servcy-black">
                      https://www.figma.com/files/team/123/Servcy
                    </span>{" "}
                    then the team id is{" "}
                    <span className="rounded-lg bg-servcy-white p-1 font-semibold text-servcy-black">
                      123
                    </span>
                  </li>
                </ul>
              </section>
            </div>
            <div className="w-full flex-col p-4">
              <form className="flex flex-col gap-4" onSubmit={configureFigma}>
                <div>
                  {loading ? (
                    <>
                      <span>Team ID</span>
                      <div className="my-3 h-5 animate-pulse rounded-full bg-servcy-white"></div>
                      <span className="mt-5">Team ID</span>
                      <div className="my-3 h-5 animate-pulse rounded-full bg-servcy-white"></div>
                    </>
                  ) : (
                    Array.from(teamIds).map((teamId, index) => (
                      <div key={index} className="py-2">
                        <span>Team ID</span>
                        <Input
                          value={teamId}
                          placeholder="Enter team ID"
                          className="my-3 p-1"
                          onChange={(e) => {
                            const newTeamIds = new Set(teamIds);
                            newTeamIds.delete(teamId);
                            newTeamIds.add(e.target.value);
                            setTeamIds(newTeamIds);
                          }}
                        />
                      </div>
                    ))
                  )}
                </div>
                {!loading && (
                  <>
                    <div className="flex items-center gap-2">
                      <Button
                        size="small"
                        className="text-sm font-thin text-servcy-white hover:!border-servcy-light hover:!text-servcy-light"
                        onClick={() => {
                          if (teamIds.has("")) return;
                          const newTeamIds = new Set(teamIds);
                          newTeamIds.add("");
                          setTeamIds(newTeamIds);
                        }}
                        disabled={teamIds.size > 2 || saving}
                      >
                        + Add More
                      </Button>
                    </div>
                    <Button
                      loading={saving}
                      disabled={saving}
                      className="w-full font-semibold text-servcy-white hover:!border-servcy-light hover:!text-servcy-light"
                    >
                      Submit
                    </Button>
                  </>
                )}
              </form>
            </div>
          </div>
        )}
      </Card>
    </Modal>
  );
}

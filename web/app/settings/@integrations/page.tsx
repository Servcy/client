"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
// Utils
import { getQueryParams } from "@/utils/Shared";

import IntegrationConfigurationModal from "@/components/Settings/IntegrationConfigurationModal";
import { Button, Card, Skeleton } from "antd";
import Image from "next/image.js";
import { AiFillSetting } from "react-icons/ai";
// APIs
import { fetchIntegrations } from "@/apis/integration";

import { Integration } from "@/types/apps/integration";

export default function IntegrationSettings(): JSX.Element {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  useEffect(() => {
    setLoading(true);
    const queryParams: Record<string, string> = getQueryParams(window.location.search);
    fetchIntegrations()
      .then((integrations) => {
        setIntegrations(integrations);
        if (queryParams["integration"]) {
          const integration = integrations.find(
            (integration: Integration) => integration.name === queryParams["integration"]
          );
          if (integration) {
            setSelectedIntegration(integration);
            setIsModalVisible(true);
          }
        }
      })
      .catch((error) => {
        toast.error(error.response.data.detail);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="xs:grid-cols-1 grid flex-auto gap-3 overflow-y-scroll rounded-lg bg-servcy-white p-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
      {loading ? (
        <>
          <Card className="min-h-[200px] animate-pulse rounded-lg">
            <Skeleton avatar paragraph={{ rows: 4 }} />
          </Card>
          <Card className="min-h-[200px] animate-pulse rounded-lg">
            <Skeleton avatar paragraph={{ rows: 4 }} />
          </Card>
          <Card className="min-h-[200px] animate-pulse rounded-lg">
            <Skeleton avatar paragraph={{ rows: 4 }} />
          </Card>
        </>
      ) : (
        integrations
          .filter((integration: Integration) => integration.is_connected)
          .map((integration: Integration) => (
            <Card key={integration.id} className="cursor-pointer rounded-lg bg-servcy-black text-servcy-white">
              <div className="flex flex-row items-center text-servcy-wheat">
                <div className="flex overflow-x-hidden">
                  {integration.logo.split(",").map((logo, index) => (
                    <Image
                      className="my-auto mr-2 max-h-[40px] min-h-[40px] min-w-[40px] max-w-[40px] rounded-lg border border-servcy-gray bg-servcy-white p-1 last-of-type:mr-5"
                      src={logo}
                      width={40}
                      key={`logo-${index}`}
                      height={40}
                      alt={integration.name}
                    />
                  ))}
                </div>
                <div className="flex-col pl-4 text-lg font-semibold">{integration.name}</div>
              </div>
              <div className="mt-2 py-3 pr-3 text-xs max-lg:h-24">{integration.description}</div>
              <div className="mt-6 flex flex-row justify-between">
                <Button
                  className="!text-servcy-white hover:!border-servcy-wheat hover:!text-servcy-wheat"
                  size="middle"
                  onClick={() => {
                    setSelectedIntegration(integration);
                    setIsModalVisible(true);
                  }}
                  icon={<AiFillSetting />}
                >
                  Configure
                </Button>
              </div>
            </Card>
          ))
      )}
      {isModalVisible && selectedIntegration !== null && (
        <IntegrationConfigurationModal
          onClose={() => {
            setIsModalVisible(false);
            setSelectedIntegration(null);
          }}
          selectedIntegration={selectedIntegration}
        />
      )}
    </div>
  );
}

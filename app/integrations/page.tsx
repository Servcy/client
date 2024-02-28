"use client";

import { oauthUrlGenerators } from "@/utils/Integration";
import { useRouter } from "next/navigation.js";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
// Components
import { Button, Card, Input, Select, Skeleton, Tag } from "antd";
import Image from "next/image.js";
import { AiOutlineApi, AiOutlineSetting } from "react-icons/ai";
import { HiArrowsRightLeft } from "react-icons/hi2";
// APIs
import { fetchIntegrations } from "@/apis/integration";
// constants
import {
  integrationCategories,
  uniqueIntegrationCategories,
} from "@/constants/integrations";
// Types
import { Integration } from "@/types/integration";
// Utils
import { getQueryParams } from "@/utils/Shared";

export default function Integrations(): JSX.Element {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    const queryParams: Record<string, string> = getQueryParams(
      window.location.search
    );
    fetchIntegrations()
      .then((results) => {
        setIntegrations(results);
        if (queryParams["integration"]) {
          const integration = results.find(
            (integration: Integration) =>
              integration.id === Number(queryParams["integration"])
          );
          if (integration) {
            setTimeout(() => {
              // click on the connect button
              const connectButton = document.getElementById(
                `connect-${integration.id}`
              );
              if (connectButton) {
                connectButton.click();
              }
            }, 1000);
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

  const connect = (integration: Integration) => {
    const oauthUrlGenerator = oauthUrlGenerators[integration.name];
    if (oauthUrlGenerator) {
      window.location.href = oauthUrlGenerator(window.location.href);
    } else {
      console.error(`Unknown integration: ${integration.name}`);
    }
  };

  return (
    <main className="order-2 h-screen flex-[1_0_16rem] overflow-y-scroll bg-servcy-gray p-3">
      <header className="mb-6 h-[80px] rounded-lg bg-servcy-white p-6">
        <div className="flex flex-row items-center">
          <AiOutlineApi size="24" />
          <p className="truncate px-2 text-xl max-md:text-lg">
            Available Integrations
          </p>
          <Input
            className="ml-auto max-w-[200px]"
            value={search}
            placeholder="search by name..."
            onChange={(event) => setSearch(event.target.value || "")}
          />
          <Select
            className="ml-2 max-w-[200px]"
            placeholder="Filter by usage"
            allowClear={true}
            options={uniqueIntegrationCategories.map((categories) => {
              return { label: categories, value: categories };
            })}
            onChange={(value) => setCategory(value)}
            onClear={() => setCategory("")}
          />
        </div>
      </header>
      <section className="xs:grid-cols-1 grid gap-3 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
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
            .filter(
              (integration) =>
                (search === "" ||
                  integration.name
                    .toLowerCase()
                    .includes(search.toLowerCase())) &&
                (!category ||
                  integrationCategories[integration.name]?.includes(category))
            )
            .map((integration: Integration) => (
              <Card
                key={integration.id}
                id={`integration-${integration.id}`}
                className="min-h-[200px] rounded-lg bg-servcy-black text-servcy-white"
              >
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
                  <div className="flex-col pl-4 text-lg font-semibold">
                    {integration.name}
                  </div>
                </div>
                <div className="mt-2 h-16 py-3 pr-3 text-xs">
                  {integration.description}
                </div>
                <div className="mt-2 h-10 py-3 pr-3">
                  {integrationCategories[integration.name] !== undefined
                    ? integrationCategories[integration.name]?.map(
                        (category: string, index: number) => (
                          <Tag
                            key={`category-${index}`}
                            className="mr-1 bg-servcy-wheat font-bold text-servcy-black"
                            bordered={false}
                          >
                            {category.charAt(0).toUpperCase() +
                              category.slice(1)}
                          </Tag>
                        )
                      )
                    : null}
                </div>
                <div className="mt-6 flex flex-row justify-between">
                  <Button
                    className="!text-servcy-white hover:!border-servcy-wheat hover:!text-servcy-wheat"
                    size="middle"
                    id={`connect-${integration.id}`}
                    onClick={() => connect(integration)}
                    icon={<HiArrowsRightLeft />}
                  >
                    Connect
                  </Button>
                  {integration.is_connected && (
                    <Button
                      className="!border-servcy-wheat !text-servcy-wheat hover:!border-servcy-white hover:!text-servcy-white"
                      size="middle"
                      icon={<AiOutlineSetting />}
                      onClick={() =>
                        router.push(
                          `/settings?selection=integrations&integration=${integration.name}`
                        )
                      }
                    >
                      Settings
                    </Button>
                  )}
                </div>
              </Card>
            ))
        )}
      </section>
    </main>
  );
}

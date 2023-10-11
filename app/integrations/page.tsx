"use client";

import { oauthUrlGenerators } from "@/utils/Integration";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
// Components
import { Button, Card, Input, Select, Skeleton, Tag, Tooltip } from "antd";
import Image from "next/image.js";
import {
  AiOutlineApi,
  AiOutlineInfoCircle,
  AiOutlineSetting,
} from "react-icons/ai";
import { HiArrowsRightLeft } from "react-icons/hi2";
// APIs
import { fetchIntegrations } from "@/apis/integration";
// constants
import {
  integrationCategories,
  uniqueIntegrationCategories,
} from "@/constants/integrations";

export interface Integration {
  id: number;
  name: string;
  logo: string;
  description: string;
  account_display_names: string[];
  configure_at: string; // relative or absolute url
}

export default function Integrations(): JSX.Element {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    fetchIntegrations()
      .then((integrations) => {
        setIntegrations(integrations);
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
        <div className="flex flex-row">
          <AiOutlineApi size="24" className="my-auto mr-2" />
          <p className="text-xl">Available Integrations</p>
          <Input
            className="ml-auto w-[250px]"
            value={search}
            placeholder="search by name..."
            onChange={(event) => setSearch(event.target.value || "")}
          />
          <Select
            className="ml-2 w-[200px]"
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
      <section className="max-xs:grid-cols-1 grid grid-cols-3 gap-3 max-sm:grid-cols-2">
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
                className="min-h-[200px] rounded-lg bg-servcy-black text-servcy-white"
              >
                <div className="flex flex-row text-servcy-wheat">
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
                  <div className="my-auto flex-col text-lg font-semibold">
                    {integration.name}
                  </div>
                  {integration.configure_at !== "None" &&
                    integration.account_display_names.length !== 0 && (
                      <a
                        href={integration.configure_at}
                        target="_blank"
                        rel="noreferrer"
                        className="my-auto ml-auto hover:text-servcy-light"
                      >
                        <AiOutlineSetting
                          size={20}
                          color="servcy-white"
                          className="hover:animate-spin"
                        />
                      </a>
                    )}
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
                    className="text-servcy-white hover:!border-servcy-wheat hover:!text-servcy-wheat"
                    size="middle"
                    onClick={() => connect(integration)}
                    icon={<HiArrowsRightLeft />}
                  >
                    Connect
                  </Button>
                  {integration.account_display_names.length !== 0 && (
                    <Tooltip
                      title={integration.account_display_names.map(
                        (account_display_name, index) => (
                          <div key={`account_display_name-${index}`}>
                            {account_display_name}
                          </div>
                        )
                      )}
                      animation="duration-500"
                      color="servcy-black"
                    >
                      <AiOutlineInfoCircle
                        size="20"
                        className="my-auto text-servcy-white hover:text-servcy-light"
                      />
                    </Tooltip>
                  )}
                </div>
              </Card>
            ))
        )}
      </section>
    </main>
  );
}

"use client";

import { oauthUrlGenerators } from "@/utils/Integration";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
// Components
import Sidebar from "@/components/Shared/sidebar";
import { Button, Card, Tooltip } from "flowbite-react";
import Image from "next/image.js";
import {
  AiOutlineApi,
  AiOutlineInfoCircle,
  AiOutlineSetting,
} from "react-icons/ai";
import { HiArrowsRightLeft } from "react-icons/hi2";
// APIs
import { fetchIntegrations } from "@/apis/integration";

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
    <div className="flex">
      <main className="order-2 h-screen flex-[1_0_16rem] overflow-y-scroll bg-slate-200 p-3">
        <header className="mb-6 h-[80px] rounded-lg bg-white p-6">
          <div className="flex flex-row">
            <AiOutlineApi className="my-auto mr-2" />
            <p className="text-xl">Available Integrations</p>
          </div>
        </header>
        <section className="max-xs:grid-cols-1 grid grid-cols-3 gap-3 max-sm:grid-cols-2">
          {loading ? (
            <>
              <Card className="min-h-[200px] animate-pulse rounded-lg">
                <div role="status" className="flex">
                  <svg
                    className="h-8 w-8 text-gray-200 dark:text-gray-700"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                  </svg>
                </div>
                <div className="mb-2.5 h-4 w-full rounded-full bg-gray-300 dark:bg-gray-700"></div>
                <div className="mb-2.5 h-4 w-full rounded-full bg-gray-300 dark:bg-gray-700"></div>
                <div className="h-4 w-full rounded-full bg-gray-300 dark:bg-gray-700"></div>
              </Card>
              <Card className="min-h-[200px] animate-pulse rounded-lg">
                <div role="status" className="flex">
                  <svg
                    className="h-8 w-8 text-gray-200 dark:text-gray-700"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                  </svg>
                </div>
                <div className="mb-2.5 h-4 w-full rounded-full bg-gray-300 dark:bg-gray-700"></div>
                <div className="mb-2.5 h-4 w-full rounded-full bg-gray-300 dark:bg-gray-700"></div>
                <div className="h-4 w-full rounded-full bg-gray-300 dark:bg-gray-700"></div>
              </Card>
              <Card className="min-h-[200px] animate-pulse rounded-lg">
                <div role="status" className="flex">
                  <svg
                    className="h-8 w-8 text-gray-200 dark:text-gray-700"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                  </svg>
                </div>
                <div className="mb-2.5 h-4 w-full rounded-full bg-gray-300 dark:bg-gray-700"></div>
                <div className="mb-2.5 h-4 w-full rounded-full bg-gray-300 dark:bg-gray-700"></div>
                <div className="h-4 w-full rounded-full bg-gray-300 dark:bg-gray-700"></div>
              </Card>
            </>
          ) : (
            integrations.map((integration: Integration) => (
              <Card key={integration.id} className="min-h-[200px] rounded-lg">
                <div className="flex flex-row">
                  <Image
                    className="my-auto mr-5 max-h-[40px] min-h-[40px] min-w-[40px] max-w-[40px] rounded-lg border border-gray-300 p-1"
                    src={integration.logo}
                    width={40}
                    height={40}
                    alt={integration.name}
                  />
                  <div className="my-auto flex-col text-lg font-semibold">
                    {integration.name}
                  </div>
                  {integration.configure_at !== "None" &&
                    integration.account_display_names.length !== 0 && (
                      <a
                        href={integration.configure_at}
                        target="_blank"
                        rel="noreferrer"
                        className="my-auto ml-auto"
                      >
                        <AiOutlineSetting
                          size={20}
                          color="gray"
                          className="hover:animate-spin"
                        />
                      </a>
                    )}
                </div>
                <div className="mt-2 text-sm">{integration.description}</div>
                <div className="mt-2 flex flex-row justify-between">
                  <Button
                    className=" enabled:hover:text-green-500"
                    color="gray"
                    outline
                    size="sm"
                    onClick={() => connect(integration)}
                  >
                    <HiArrowsRightLeft className="my-auto mr-2" />
                    Connect
                  </Button>
                  {integration.account_display_names.length !== 0 && (
                    <Tooltip
                      content={integration.account_display_names.map(
                        (account_display_name, index) => (
                          <div key={`account_display_name-${index}`}>
                            {account_display_name}
                          </div>
                        )
                      )}
                      placement="bottom-start"
                      animation="duration-500"
                    >
                      <Button
                        className="border-1 h-full border-green-500 p-0"
                        color="green"
                        pill
                        outline
                        size="sm"
                      >
                        <AiOutlineInfoCircle
                          className="my-auto"
                          color="green"
                        />
                      </Button>
                    </Tooltip>
                  )}
                </div>
              </Card>
            ))
          )}
        </section>
      </main>
      <div className="order-1">
        <Sidebar />
      </div>
    </div>
  );
}

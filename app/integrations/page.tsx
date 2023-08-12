"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
// Components
import Sidebar from "@/components/Shared/sidebar";
import { getGoogleUrl } from "@/utils/Integration/gmail";
import { Button, Card, Tooltip } from "flowbite-react";
import Image from "next/image.js";
import { AiOutlineApi, AiOutlineSafety } from "react-icons/ai";
import { HiArrowsRightLeft } from "react-icons/hi2";
// APIs
import { fetchIntegrations } from "@/apis/integration";

export interface Integration {
  id: number;
  name: string;
  logo: string;
  description: string;
  account_ids: string[];
}

export default function Integrations(): JSX.Element {
  const [integrations, setIntegrations] = useState<Integration[]>([]);

  useEffect(() => {
    fetchIntegrations()
      .then((integrations) => {
        setIntegrations(integrations);
      })
      .catch((error) => {
        toast.error(error.response.data.detail);
      });
  }, []);

  const connect = (integration: Integration) => {
    if (integration.name === "Gmail")
      window.location.href = getGoogleUrl(window.location.href);
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
          {integrations.map((integration: Integration) => (
            <Card key={integration.id} className="min-h-[200px] rounded-lg">
              <div className="flex flex-row">
                <Image
                  className="my-auto mr-5 min-h-[40px] rounded-lg border border-gray-300 p-1"
                  src={integration.logo}
                  width={40}
                  height={40}
                  alt={integration.name}
                />
                <div className="my-auto flex-col text-lg font-semibold">
                  {integration.name}
                </div>
              </div>
              <div className="mt-2 text-sm">{integration.description}</div>
              {integration.account_ids.length === 0 ? (
                <div>
                  <Button
                    className="mt-2 flex-1 enabled:hover:text-green-500"
                    color="gray"
                    outline
                    size="sm"
                    onClick={() => connect(integration)}
                  >
                    <HiArrowsRightLeft className="my-auto mr-2" />
                    Connect
                  </Button>
                </div>
              ) : (
                <div>
                  <Tooltip
                    content={integration.account_ids.map((id) => (
                      <div key={id}>{id}</div>
                    ))}
                    placement="bottom-start"
                    animation="duration-500"
                  >
                    <Button
                      className="border-1 mt-2 flex-1 border-green-500 p-0"
                      color="green"
                      outline
                      size="sm"
                    >
                      <AiOutlineSafety className="my-auto mr-2" color="green" />
                      <span className="text-green-500">Connected</span>
                    </Button>
                  </Tooltip>
                </div>
              )}
            </Card>
          ))}
        </section>
      </main>
      <div className="order-1">
        <Sidebar />
      </div>
    </div>
  );
}

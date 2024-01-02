"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
// Components
import { Button, Card, Skeleton } from "antd";
import Image from "next/image.js";
import {
  AiFillApi,
  AiFillSetting,
  AiOutlineArrowRight,
  AiOutlineSetting,
} from "react-icons/ai";
// APIs
import { fetchIntegrations } from "@/apis/integration";
// Types
import { Integration } from "@/types/integration";

export default function Settings(): JSX.Element {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    fetchIntegrations()
      .then((integrations) => {
        setIntegrations(
          integrations.sort(
            (a: Integration, b: Integration) =>
              Number(a.is_wip) - Number(b.is_wip)
          )
        );
      })
      .catch((error) => {
        toast.error(error.response.data.detail);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  const router = useRouter();

  return (
    <main className="order-2 h-screen flex-[1_0_16rem] overflow-y-scroll bg-servcy-gray p-3">
      <header className="mb-6 h-[80px] rounded-lg bg-servcy-white p-6">
        <div className="flex flex-row">
          <AiOutlineSetting size="24" className="my-auto mr-2" />
          <p className="text-xl">Settings</p>
        </div>
      </header>
      <div className="flex gap-4">
        <div className="w-56 flex-none rounded-lg bg-servcy-white p-6">
          <div className="flex flex-col gap-4 font-semibold">
            <div className="servcy-small-title flex flex-row items-center gap-2 text-xs text-servcy-neutral">
              Quick Access Menu
            </div>
            <hr className="h-[1.5px] border-none bg-servcy-wheat" />
            <div className="flex flex-col gap-4 text-sm text-servcy-neutral">
              <button className="border-1 flex cursor-pointer flex-row rounded-lg border-servcy-black p-2 hover:border-none hover:bg-servcy-wheat hover:text-servcy-black">
                <AiFillApi size="18" className="my-auto mr-2" />
                <p>Integrations</p>
                <AiOutlineArrowRight size="16" className="my-auto ml-auto" />
              </button>
            </div>
          </div>
        </div>
        <div className="xs:grid-cols-1 grid flex-auto gap-3 rounded-lg bg-servcy-white p-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
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
                (integration: Integration) =>
                  integration.account_display_names.length > 0
              )
              .map((integration: Integration) => (
                <Card
                  key={integration.id}
                  className="min-h-[200px] cursor-pointer rounded-lg bg-servcy-black text-servcy-white"
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
                  <div className="mt-2 h-16 py-3 pr-3 text-xs max-lg:h-24">
                    {integration.description}
                  </div>
                  <div className="mt-6 flex flex-row justify-between">
                    <Button
                      className="!text-servcy-white hover:!border-servcy-wheat hover:!text-servcy-wheat"
                      size="middle"
                      onClick={() => router.push(``)}
                      icon={<AiFillSetting />}
                      disabled={integration.is_wip}
                    >
                      Configure
                    </Button>
                  </div>
                </Card>
              ))
          )}
        </div>
      </div>
    </main>
  );
}

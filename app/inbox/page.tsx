"use client";

import cn from "classnames";
import { useEffect, useState } from "react";
// Components
import { Button } from "antd";
import { AiOutlineInbox, AiOutlineSync } from "react-icons/ai";
// APIs
import { syncInbox as syncInboxApi } from "@/apis/inbox";

export default function Gmail(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);

  const syncInbox = async () => {
    try {
      setLoading(true);
      const response = await syncInboxApi();
      console.info(response);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncInbox();
  }, []);

  return (
    <main className="order-2 h-screen flex-[1_0_16rem] overflow-y-scroll bg-servcy-gray p-3">
      <header className="mb-6 h-[80px] rounded-lg bg-servcy-white p-6">
        <div className="flex">
          <AiOutlineInbox className="my-auto mr-2" size="24" />
          <p className="text-xl">Inbox</p>
          <Button
            onClick={syncInbox}
            className="border-1 ml-auto h-full border-green-500 p-0"
            color="green"
          >
            <AiOutlineSync
              className={cn("my-auto", {
                "animate-spin": loading,
              })}
            />
          </Button>
        </div>
      </header>
      <section className="max-xs:grid-cols-1 grid grid-cols-3 gap-3 max-sm:grid-cols-2"></section>
    </main>
  );
}

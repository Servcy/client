"use client";

import cn from "classnames";
import { useEffect, useState } from "react";
// Components
import InboxItems from "@/components/Inbox/InboxItems";
import { Button, ConfigProvider, Select, Tabs } from "antd";
import {
  AiOutlineComment,
  AiOutlineInbox,
  AiOutlineMessage,
  AiOutlineNotification,
  AiOutlineSync,
} from "react-icons/ai";
// APIs
import { fetchInbox as fetchInboxApi } from "@/apis/inbox";
// Types
import { InboxItem, PaginationDetails } from "@/types/inbox";
// constants
import { integrationCategories } from "@/constants/integrations";

const tabItems = [
  {
    key: "message",
    label: "Messages",
    Icon: AiOutlineMessage,
  },
  {
    key: "comment",
    label: "Comments",
    Icon: AiOutlineComment,
  },
  {
    key: "notification",
    label: "Notifications",
    Icon: AiOutlineNotification,
  },
];

export default function Gmail(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const [inboxItems, setInboxItems] = useState<InboxItem[]>([] as InboxItem[]);
  const [inboxPagination, setInboxPagination] = useState<PaginationDetails>(
    {} as PaginationDetails
  );
  const [activeTab, setActiveTab] = useState<string>("message");
  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState<Record<string, string>>({
    category: "message",
  });
  const [search, setSearch] = useState<Record<string, string>>({});

  const refetchInboxItems = async () => {
    try {
      setLoading(true);
      const response = await fetchInboxApi({ filters, search, page });
      setInboxItems(JSON.parse(response.results).items);
      setInboxPagination(JSON.parse(response.results).details);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInboxItems = async () => {
      try {
        setLoading(true);
        const response = await fetchInboxApi({ filters, search, page });
        setInboxItems(JSON.parse(response.results).items);
        setInboxPagination(JSON.parse(response.results).details);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInboxItems();
  }, [page, filters, search, activeTab]);

  return (
    <main className="order-2 h-screen flex-[1_0_16rem] overflow-y-scroll bg-servcy-gray p-3">
      <header className="mb-6 h-[80px] rounded-lg bg-servcy-white p-6">
        <div className="flex">
          <AiOutlineInbox className="my-auto mr-2" size="24" />
          <p className="text-xl">Inbox</p>
          <Button
            onClick={refetchInboxItems}
            className="ml-auto h-full p-0 hover:!border-servcy-green hover:!text-servcy-green"
          >
            <AiOutlineSync
              className={cn("my-auto", {
                "animate-spin": loading,
              })}
              size="24"
            />
          </Button>
        </div>
      </header>
      <div className="mb-6 min-h-[80px] rounded-lg bg-servcy-white p-6 text-lg">
        <ConfigProvider
          theme={{
            components: {
              Tabs: {
                inkBarColor: "#032123",
              },
            },
          }}
        >
          <Tabs
            defaultActiveKey="message"
            indicatorSize={(origin) => origin - 16}
            onChange={(key) => {
              setFilters((prevState) => {
                return { ...prevState, category: key };
              });
              setActiveTab(key);
            }}
            tabBarExtraContent={
              <Select
                placeholder="Filter By Source"
                allowClear
                onClear={() => {
                  setFilters((prevState) => {
                    return { ...prevState, source: "" };
                  });
                }}
                onChange={(value) => {
                  setFilters((prevState) => {
                    return { ...prevState, source: value };
                  });
                }}
                options={Object.keys(integrationCategories).map(
                  (key: string) => {
                    return {
                      label: key,
                      value: key,
                    };
                  }
                )}
              />
            }
            items={tabItems.map((item) => {
              return {
                label: (
                  <div
                    className={cn(
                      "flex justify-center align-middle hover:!text-servcy-dark",
                      {
                        "text-servcy-green font-semibold":
                          activeTab === item.key,
                      }
                    )}
                  >
                    <item.Icon className="my-auto mr-2" />
                    {item.label}
                  </div>
                ),
                key: item.key,
                children: (
                  <InboxItems
                    setPage={setPage}
                    loading={loading}
                    page={page}
                    filters={filters}
                    setFilters={setFilters}
                    inboxPagination={inboxPagination}
                    setSearch={setSearch}
                    search={search}
                    inboxItems={inboxItems}
                  />
                ),
              };
            })}
          />
        </ConfigProvider>
      </div>
    </main>
  );
}

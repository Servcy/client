"use client";

import cn from "classnames";
import debounce from "lodash/debounce";
import { useEffect, useState } from "react";
// Components
import InboxItemModal from "@/components/Inbox/InboxItemModal";
import InboxItems from "@/components/Inbox/InboxItems";
import { Button, ConfigProvider, Input, Select, Tabs } from "antd";
import {
  AiOutlineComment,
  AiOutlineInbox,
  AiOutlineMessage,
  AiOutlineNotification,
  AiOutlineRead,
  AiOutlineSync,
} from "react-icons/ai";
import { GoMention } from "react-icons/go";
import { HiArchiveBoxArrowDown } from "react-icons/hi2";
// APIs
import {
  archiveItems as archiveItemsApi,
  deleteItems as deleteItemsApi,
  fetchInbox as fetchInboxApi,
  readItem as readItemApi,
} from "@/apis/inbox";
// Types
import { InboxItem, PaginationDetails } from "@/types/apps/inbox";
// constants
import { integrationInboxCategories } from "@/constants/integrations";

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
  {
    key: "archived",
    label: "Archived",
    Icon: AiOutlineRead,
  },
];

export default function Gmail(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [selectedItemIds, setSelectedItemIds] = useState<React.Key[]>([]);
  const [inboxItems, setInboxItems] = useState<InboxItem[]>([] as InboxItem[]);
  const [inboxPagination, setInboxPagination] = useState<PaginationDetails>({} as PaginationDetails);
  const [activeTab, setActiveTab] = useState<string>("message");
  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState<Record<string, string | boolean>>({
    category: "message",
  });
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(-1);
  const [isInboxItemModalVisible, setIsInboxItemModalVisible] = useState<boolean>(false);
  const [filterByIAmMentionedButtonText, setFilterByIAmMentionedButtonText] = useState<string>("For Me");

  const refetchInboxItems = async () => {
    try {
      setLoading(true);
      const response = await fetchInboxApi({
        filters,
        search,
        page,
        pagination: { page },
      });
      setInboxItems(JSON.parse(response.results).items);
      setInboxPagination(JSON.parse(response.results).details);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const archiveItems = async (itemIds: React.Key[]) => {
    try {
      await archiveItemsApi({
        item_ids: itemIds,
      });
      if (itemIds.length === inboxItems.length) {
        setInboxItems([]);
        refetchInboxItems();
      } else setInboxItems((prevState) => prevState.filter((item) => !itemIds.includes(parseInt(item.id))));
    } catch (err) {
      console.error(err);
    }
  };

  const readItem = async (itemId: string | undefined) => {
    try {
      if (!itemId) return;
      readItemApi({
        item_id: Number.parseInt(itemId),
      });
      setInboxItems((prevState) =>
        prevState.map((item) => {
          if (item.id === itemId.toString()) {
            return { ...item, is_read: true };
          }
          return item;
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  const deleteItems = async (itemIds: number[]) => {
    try {
      deleteItemsApi({
        item_ids: itemIds,
      });
      if (itemIds.length === inboxItems.length) {
        setInboxItems([]);
        refetchInboxItems();
      } else setInboxItems((prevState) => prevState.filter((item) => !itemIds.includes(parseInt(item.id))));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const debouncedFetchInbox = debounce(async () => {
      try {
        setLoading(true);
        const response = await fetchInboxApi({
          filters,
          search,
          page,
          pagination: { page },
        });
        setInboxItems(JSON.parse(response.results).items);
        setInboxPagination(JSON.parse(response.results).details);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 500);
    debouncedFetchInbox();
    return () => {
      debouncedFetchInbox.cancel();
    };
  }, [page, filters, search, activeTab]);

  return (
    <main className="order-2 h-screen flex-[1_0_16rem] overflow-y-scroll bg-servcy-gray p-3">
      <header className="mb-6 h-[80px] rounded-lg bg-servcy-white p-6">
        <div className="flex">
          <AiOutlineInbox className="my-auto mr-2" size="24" />
          <p className="text-xl">Inbox</p>
          <Input
            className="ml-auto max-w-[200px]"
            value={search}
            placeholder="search by notification..."
            onChange={(event) => setSearch(event.target.value || "")}
          />
          <Button
            onClick={refetchInboxItems}
            className="ml-2 h-full p-0 hover:!border-servcy-green hover:!text-servcy-green"
            disabled={loading}
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
              setFilters((prevState) => ({ ...prevState, category: key }));
              setActiveTab(key);
              if (key === "comment") {
                setFilterByIAmMentionedButtonText("Mentions Me");
              } else {
                setFilterByIAmMentionedButtonText("For Me");
              }
            }}
            tabBarExtraContent={
              <div className="flex">
                <Button
                  className={cn("mr-2 text-sm hover:!border-servcy hover:!text-servcy", {
                    "!border-servcy !text-servcy": filters["i_am_mentioned"],
                  })}
                  onClick={() => {
                    setFilters((prevState) => ({
                      ...prevState,
                      i_am_mentioned: !prevState["i_am_mentioned"],
                    }));
                  }}
                  icon={<GoMention />}
                >
                  <span>{filterByIAmMentionedButtonText}</span>
                </Button>
                <Button
                  className="mr-2 text-sm hover:!border-red-400 hover:!text-red-400"
                  disabled={inboxItems.length === 0}
                  onClick={() => {
                    if (activeTab !== "archived") archiveItems(inboxItems.map((item) => parseInt(item.id)));
                    else deleteItems(inboxItems.map((item) => parseInt(item.id)));
                  }}
                  icon={<HiArchiveBoxArrowDown />}
                >
                  <span>
                    {activeTab === "archived" ? "Delete" : "Archive"} All ({inboxItems.length})
                  </span>
                </Button>
                <Button
                  className="mr-2 text-sm hover:!border-red-400 hover:!text-red-400"
                  disabled={selectedItemIds.length === 0}
                  onClick={() => {
                    if (activeTab !== "archived")
                      archiveItems(selectedItemIds.map((item_id) => parseInt(item_id.toString())));
                    else deleteItems(selectedItemIds.map((item_id) => parseInt(item_id.toString())));
                  }}
                  icon={<HiArchiveBoxArrowDown />}
                >
                  <span>{activeTab === "archived" ? "Delete" : "Archive"} Selected</span>
                </Button>
                <Select
                  placeholder="Filter By Source"
                  allowClear
                  onClear={() => {
                    setFilters((prevState) => ({ ...prevState, source: "" }));
                  }}
                  value={filters["source"]}
                  onChange={(value) => {
                    setFilters((prevState) => ({ ...prevState, source: value }));
                  }}
                  options={Object.entries(integrationInboxCategories)
                    .filter(([_, value]) => value.includes(activeTab))
                    .map(([key, _]) => ({ label: key, value: key }))}
                />
              </div>
            }
            items={tabItems.map((item) => ({
              label: (
                <div
                  className={cn("flex justify-center align-middle hover:!text-servcy-dark", {
                    "text-servcy-green font-semibold": activeTab === item.key,
                  })}
                >
                  <item.Icon className="my-auto mr-2" />
                  {item.label} {activeTab === item.key ? `(${inboxPagination.total_items || "-"})` : ""}
                </div>
              ),
              key: item.key,
              children: (
                <InboxItems
                  setPage={setPage}
                  page={page}
                  inboxPagination={inboxPagination}
                  setSelectedRowIndex={setSelectedRowIndex}
                  setIsInboxItemModalVisible={setIsInboxItemModalVisible}
                  archiveItems={archiveItems}
                  inboxItems={inboxItems}
                  readItem={readItem}
                  activeTab={activeTab}
                  loading={loading}
                  deleteItems={deleteItems}
                  setSelectedItemIds={setSelectedItemIds}
                />
              ),
            }))}
          />
        </ConfigProvider>
      </div>
      {isInboxItemModalVisible && (
        <InboxItemModal
          selectedRow={inboxItems[selectedRowIndex] ?? ({} as InboxItem)}
          setIsInboxItemModalVisible={setIsInboxItemModalVisible}
          selectedRowIndex={selectedRowIndex}
          readItem={readItem}
          setSelectedRowIndex={setSelectedRowIndex}
          totalInboxItems={inboxItems.length}
        />
      )}
    </main>
  );
}

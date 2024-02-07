"use client";

// Types
import { InboxItem, PaginationDetails } from "@/types/inbox";
import type { ColumnsType } from "antd/es/table";
import React, { Dispatch, SetStateAction } from "react";
// Compponents
import { SyncOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  ConfigProvider,
  Spin,
  Table,
  Tag,
  Tooltip,
} from "antd";
import toast from "react-hot-toast";
import { HiArchiveBoxArrowDown } from "react-icons/hi2";
import { MdOutlineBlock } from "react-icons/md";
import Cause from "./Cause";
// APIs
import { disableNotificationType } from "@/apis/integration";

const InboxItems = ({
  setPage,
  page,
  loading,
  inboxItems,
  inboxPagination,
  setFilters,
  archiveItems,
  setSelectedRowIndex,
  setIsInboxItemModalVisible,
  setSelectedItemIds,
  activeTab,
}: {
  setPage: Dispatch<SetStateAction<number>>;
  page: number;
  loading: boolean;
  inboxItems: InboxItem[];
  inboxPagination: PaginationDetails;
  activeTab: string;
  archiveItems: (_: React.Key[]) => void;
  setFilters: Dispatch<SetStateAction<Record<string, string | boolean>>>;
  setSearch: Dispatch<SetStateAction<Record<string, string>>>;
  setSelectedItemIds: Dispatch<SetStateAction<React.Key[]>>;
  setSelectedRowIndex: Dispatch<SetStateAction<number>>;
  setIsInboxItemModalVisible: Dispatch<SetStateAction<boolean>>;
}) => {
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedItemIds(selectedRowKeys);
    },
    getCheckboxProps: (record: InboxItem) => ({
      disabled: record.is_archived,
      name: record.id,
    }),
  };

  const disableNotificationTypeHandler = (
    event: string,
    user_integration_id: number
  ) => {
    disableNotificationType({ event, user_integration_id })
      .then(() => {
        toast.success("Notification type disabled successfully");
      })
      .catch(() => {
        toast.error("Error in disabling notification type");
      });
  };

  const columns: ColumnsType<InboxItem> = [
    {
      dataIndex: "title",
      title: "Title",
      render: (title, _, index) => {
        return (
          <button
            className="cursor-pointer text-left"
            onClick={() => {
              setSelectedRowIndex(index);
              setIsInboxItemModalVisible(true);
            }}
          >
            {title}
          </button>
        );
      },
    },
    {
      dataIndex: "source",
      width: 100,
      title: "Source",
      render: (source) => {
        return (
          <Tag
            key={source}
            className="cursor-pointer bg-servcy-wheat font-bold text-servcy-black"
            onClick={() => {
              setFilters((prevState: object) => {
                return { ...prevState, source: source };
              });
            }}
          >
            {source}
          </Tag>
        );
      },
    },
    {
      dataIndex: "account",
      width: 100,
      title: "Source",
      render: (account) => {
        return (
          <div className="flex min-h-[50px] max-w-[250px] items-center text-sm">
            <Avatar className="mr-2 rounded-full" size="small">
              {account.slice(0, 1).toUpperCase()}
            </Avatar>
            <div className="overflow-hidden truncate">{account}</div>
          </div>
        );
      },
    },
    {
      dataIndex: "cause",
      title: "From",
      width: 200,
      render: (cause, record) => {
        return <Cause cause={cause} source={record.source} />;
      },
    },
    {
      dataIndex: "created_at",
      title: "Date",
      width: 200,
      render: (date) => {
        return new Date(date).toLocaleDateString(
          navigator.language || "en-US",
          {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          }
        );
      },
    },
    {
      dataIndex: "id",
      title: "Actions",
      width: 100,
      render: (id, record) => {
        return (
          <>
            <Tooltip title="Mark Read">
              <Button
                type="primary"
                className="bg-servcy-cream text-servcy-black hover:!bg-servcy-wheat"
                size="small"
                onClick={() => {
                  archiveItems([parseInt(id)]);
                }}
                icon={<HiArchiveBoxArrowDown className="mt-1" />}
              ></Button>
            </Tooltip>
            {activeTab === "notification" && record.cause !== "None" && (
              <Tooltip title="Disable these type of notifications">
                <Button
                  type="primary"
                  className="ml-2 bg-servcy-cream text-servcy-black hover:!bg-servcy-wheat"
                  size="small"
                  icon={<MdOutlineBlock className="mt-1" />}
                  onClick={() => {
                    disableNotificationTypeHandler(
                      record.body,
                      record.user_integration_id
                    );
                  }}
                ></Button>
              </Tooltip>
            )}
          </>
        );
      },
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            rowHoverBg: "#2B3232",
            headerBg: "#F1F2EF",
            rowSelectedBg: "#2B3232",
            rowSelectedHoverBg: "#2B3232",
          },
        },
      }}
    >
      <Table
        dataSource={inboxItems}
        columns={columns}
        rowKey={(record) => record.id}
        className="overflow-x-scroll"
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        rowClassName={() => {
          return "bg-servcy-black text-white rounded-tr";
        }}
        showHeader={false}
        loading={{
          spinning: loading,
          indicator: (
            <Spin
              className="m-auto"
              size="large"
              indicator={
                <SyncOutlined
                  spin
                  style={{
                    color: "#26542F",
                  }}
                />
              }
            />
          ),
        }}
        pagination={{
          current: page,
          pageSize: 10,
          total: inboxPagination.total_items,
          onChange: (page) => {
            setPage(page);
          },
        }}
      />
    </ConfigProvider>
  );
};

export default InboxItems;

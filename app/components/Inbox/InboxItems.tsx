"use client";

// Types
import { InboxItem, PaginationDetails } from "@/types/inbox";
import type { ColumnsType } from "antd/es/table";
import React, { Dispatch, SetStateAction } from "react";
// Compponents
import { SyncOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Spin, Table, Tag, Tooltip } from "antd";
import { HiArchiveBoxArrowDown } from "react-icons/hi2";
import Cause from "./Cause";

const InboxItems = ({
  setPage,
  page,
  loading,
  inboxItems,
  inboxPagination,
  setFilters,
  archiveItems,
  setSelectedRow,
  setIsInboxItemModalVisible,
  setSelectedItemIds,
}: {
  setPage: Dispatch<SetStateAction<number>>;
  page: number;
  loading: boolean;
  inboxItems: InboxItem[];
  inboxPagination: PaginationDetails;

  archiveItems: (_: React.Key[]) => void;
  setFilters: Dispatch<SetStateAction<Record<string, string>>>;
  setSearch: Dispatch<SetStateAction<Record<string, string>>>;
  setSelectedItemIds: Dispatch<SetStateAction<React.Key[]>>;
  setSelectedRow: Dispatch<SetStateAction<InboxItem>>;
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

  const columns: ColumnsType<InboxItem> = [
    {
      dataIndex: "title",
      title: "Title",
      render: (title, record) => {
        return (
          <button
            className="cursor-pointer"
            onClick={() => {
              setSelectedRow(record);
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
      render: (id) => {
        return (
          <Tooltip title="Mark Read">
            <Button
              type="primary"
              className="bg-servcy-cream text-servcy-black hover:!bg-servcy-wheat"
              size="small"
              onClick={() => {
                archiveItems([parseInt(id)]);
              }}
              icon={<HiArchiveBoxArrowDown />}
            ></Button>
          </Tooltip>
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
                  rev={1}
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

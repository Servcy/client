"use client";

// Types
import { InboxItem, PaginationDetails } from "@/types/inbox";
import type { ColumnsType } from "antd/es/table";
import React, { Dispatch, SetStateAction } from "react";
// Compponents
import { Button, ConfigProvider, Table, Tag } from "antd";
import { AiOutlineDelete } from "react-icons/ai";
import Cause from "./Cause";

const InboxItems = ({
  setPage,
  page,
  loading,
  inboxItems,
  inboxPagination,
  deleteItem,
  setSelectedItemIds,
}: {
  setPage: Dispatch<SetStateAction<number>>;
  page: number;
  loading: boolean;
  inboxItems: InboxItem[];
  inboxPagination: PaginationDetails;
  // eslint-disable-next-line no-unused-vars
  deleteItem: (_: number) => void;
  setFilters: Dispatch<SetStateAction<Record<string, string>>>;
  setSearch: Dispatch<SetStateAction<Record<string, string>>>;
  setSelectedItemIds: Dispatch<SetStateAction<React.Key[]>>;
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
    },
    {
      dataIndex: "source",
      width: 100,
      title: "Source",
      render: (source) => {
        return (
          <Tag key={source} className="bg-servcy-wheat text-white">
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
      title: "Actions",
      width: 100,
      render: (id) => {
        return (
          <Button
            type="primary"
            danger
            size="small"
            onClick={() => {
              deleteItem(id);
            }}
            icon={<AiOutlineDelete />}
          ></Button>
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
          return "bg-servcy-black text-white cursor-pointer rounded-tr";
        }}
        showHeader={false}
        loading={loading}
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

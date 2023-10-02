"use client";

// Types
import { InboxItem, PaginationDetails } from "@/types/inbox";
import type { ColumnsType } from "antd/es/table";
import { Dispatch, SetStateAction } from "react";
// Compponents
import { Table } from "antd";

const columns: ColumnsType<InboxItem> = [
  {
    dataIndex: "title",
  },
  {
    dataIndex: "cause",
  },
  {
    dataIndex: "created_at",
    render: (date) => {
      return new Date(date).toLocaleDateString(navigator.language || "en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      });
    },
  },
];

const InboxItems = ({
  setPage,
  page,
  // eslint-disable-next-line no-unused-vars
  filters,
  loading,
  // eslint-disable-next-line no-unused-vars
  setFilters,
  // eslint-disable-next-line no-unused-vars
  search,
  // eslint-disable-next-line no-unused-vars
  setSearch,
  inboxItems,
  inboxPagination,
}: {
  setPage: Dispatch<SetStateAction<number>>;
  page: number;
  loading: boolean;
  filters: Record<string, string>;
  search: Record<string, string>;
  setFilters: Dispatch<SetStateAction<Record<string, string>>>;
  setSearch: Dispatch<SetStateAction<Record<string, string>>>;
  inboxItems: InboxItem[];
  inboxPagination: PaginationDetails;
}) => {
  return (
    <Table
      dataSource={inboxItems}
      columns={columns}
      rowKey={(record) => record.id}
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
  );
};

export default InboxItems;

"use client";

// Types
import { InboxItem, PaginationDetails } from "@/types/inbox";
import { Dispatch, SetStateAction } from "react";

const InboxItems = ({
  setPage,
  page,
  filters,
  setFilters,
  inboxItems,
  inboxPagination,
}: {
  setPage: Dispatch<SetStateAction<number>>;
  page: number;
  filters: Record<string, string>;
  setFilters: Dispatch<SetStateAction<Record<string, string>>>;
  inboxItems: InboxItem[];
  inboxPagination: PaginationDetails;
}) => {
  return (
    <div>
      <p>Inbox Items</p>
    </div>
  );
};

export default InboxItems;

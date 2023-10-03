"use client";

// Compponents
import { Modal } from "antd";
// Types
import { InboxItem } from "@/types/inbox";

const InboxItemModal = ({
  selectedRow,
  setIsInboxItemModalVisible,
}: {
  selectedRow: InboxItem;
  // eslint-disable-next-line no-unused-vars
  setIsInboxItemModalVisible: (value: boolean) => void;
}) => {
  return (
    <Modal
      open={true}
      onCancel={() => setIsInboxItemModalVisible(false)}
    ></Modal>
  );
};

export default InboxItemModal;

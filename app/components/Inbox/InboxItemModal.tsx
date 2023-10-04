"use client";

// dependencies
import * as DOMPurify from "dompurify";
// Compponents
import { Modal } from "antd";
// Types
import { InboxItem } from "@/types/inbox";

const InboxItemModal = ({
  selectedRow,
  setIsInboxItemModalVisible,
}: {
  selectedRow: InboxItem;

  setIsInboxItemModalVisible: (value: boolean) => void;
}) => {
  let body = selectedRow.body;
  if (selectedRow.source === "Gmail") {
    body = Buffer.from(body, "base64").toString("utf8");
  }
  if (selectedRow.is_body_html) {
    body = DOMPurify.sanitize(body);
  }
  return (
    <Modal
      open={true}
      title={selectedRow.title}
      onCancel={() => setIsInboxItemModalVisible(false)}
      footer={false}
      width={1000}
    >
      {selectedRow.is_body_html ? (
        <div
          dangerouslySetInnerHTML={{
            __html: body,
          }}
        />
      ) : (
        <p>{body}</p>
      )}
    </Modal>
  );
};

export default InboxItemModal;

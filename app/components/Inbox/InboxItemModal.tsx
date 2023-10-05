"use client";

// dependencies
import * as DOMPurify from "dompurify";
// Compponents
import { Button, Modal, Tag } from "antd";
import { HiArchiveBoxArrowDown } from "react-icons/hi2";
import FigmaNotification from "./FigmaNotification";
import NotionComment from "./NotionComment";
import SlackMessage from "./SlackMessage";
// Types
import { InboxItem } from "@/types/inbox";

const InboxItemModal = ({
  selectedRow,
  setIsInboxItemModalVisible,
  markRead,
}: {
  selectedRow: InboxItem;
  setIsInboxItemModalVisible: (value: boolean) => void;
  markRead: (_: React.Key[]) => void;
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
      width="80vw"
      bodyStyle={{
        overflowY: "scroll",
        overflowX: "hidden",
      }}
    >
      <div className="border-1 mt-2 grid grid-cols-3 gap-4 rounded-lg border-servcy-black shadow-sm">
        {selectedRow.is_body_html ? (
          <div
            dangerouslySetInnerHTML={{
              __html: body,
            }}
            className="col-span-2 max-h-[600px] overflow-y-scroll p-1"
          />
        ) : selectedRow.source === "Notion" ? (
          <NotionComment
            data={JSON.parse(selectedRow.body)}
            cause={selectedRow.cause}
          />
        ) : selectedRow.source === "Figma" ? (
          <FigmaNotification
            data={JSON.parse(selectedRow.body)}
            cause={selectedRow.cause}
          />
        ) : selectedRow.source === "Slack" ? (
          <SlackMessage
            data={JSON.parse(selectedRow.body)}
            cause={selectedRow.cause}
          />
        ) : (
          <div className="col-span-2 max-h-[600px] overflow-y-scroll p-1">
            {body}
          </div>
        )}
        <div className="col-span-1 h-full px-3">
          <div className="py-5">
            <Tag
              key={selectedRow.source}
              className="m-1 bg-servcy-wheat font-bold text-servcy-white"
            >
              {selectedRow.source}
            </Tag>
            <Tag
              key={selectedRow.category}
              className="m-1 bg-servcy-wheat font-bold text-servcy-white"
            >
              {selectedRow.category[0]?.toLocaleUpperCase() +
                selectedRow.category.slice(1)}
            </Tag>
            <Tag
              key={selectedRow.account}
              className="m-1 bg-servcy-wheat font-bold text-servcy-white"
            >
              {selectedRow.account}
            </Tag>
          </div>
          <Button
            className="mb-4 w-full text-sm hover:!border-red-400 hover:!text-red-400"
            icon={<HiArchiveBoxArrowDown />}
            onClick={() => markRead([selectedRow.id])}
          >
            <span>Mark Read</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default InboxItemModal;

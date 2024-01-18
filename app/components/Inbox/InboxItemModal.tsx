"use client";

// dependencies
import * as DOMPurify from "dompurify";
import { useEffect } from "react";
// Compponents
import { Button, Modal } from "antd";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaReply } from "react-icons/fa";
import AsanaNotification from "./AsanaNotification";
import FigmaNotification from "./FigmaNotification";
import GithubNotification from "./GithubNotification";
import NotionComment from "./NotionComment";
import SlackMessage from "./SlackMessage";
import TrelloNotification from "./TrelloNotification";
// Types
import { InboxItem } from "@/types/inbox";

const InboxItemModal = ({
  selectedRow,
  setIsInboxItemModalVisible,
  selectedRowIndex,
  setSelectedRowIndex,
  totalInboxItems,
  activeTab,
}: {
  selectedRow: InboxItem;
  setIsInboxItemModalVisible: (value: boolean) => void;
  selectedRowIndex: number;
  setSelectedRowIndex: (value: number) => void;
  totalInboxItems: number;
  activeTab: string;
}) => {
  let body = selectedRow.body;
  if (selectedRow.source === "Gmail") {
    body = Buffer.from(body, "base64").toString("utf8");
  }
  if (selectedRow.is_body_html) {
    body = DOMPurify.sanitize(body);
  }

  useEffect(() => {
    const handleArrowRight = () => {
      if (selectedRowIndex < totalInboxItems - 1)
        setSelectedRowIndex(selectedRowIndex + 1);
    };
    const handleArrowLeft = () => {
      if (selectedRowIndex > 0) setSelectedRowIndex(selectedRowIndex - 1);
    };
    const handleKeydown = (e: KeyboardEvent) => {
      // move to next item on right arrow key press
      if (e.key === "ArrowRight") handleArrowRight();
      // move to previous item on left arrow key press
      else if (e.key === "ArrowLeft") handleArrowLeft();
    };
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [
    selectedRowIndex,
    setSelectedRowIndex,
    totalInboxItems,
    setIsInboxItemModalVisible,
  ]);

  return (
    <Modal
      open={true}
      title={selectedRow.title}
      onCancel={() => setIsInboxItemModalVisible(false)}
      footer={false}
      width="70vw"
      style={{ top: "50%", transform: "translateY(-50%)" }}
    >
      <div>
        {/* body */}
        <div className="border-1 mt-2 rounded-lg border-servcy-black shadow-sm">
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
          ) : selectedRow.source === "Asana" ? (
            <AsanaNotification
              data={JSON.parse(selectedRow.body)}
              cause={JSON.parse(selectedRow.cause)}
            />
          ) : selectedRow.source === "Trello" ? (
            <TrelloNotification
              data={JSON.parse(selectedRow.body)}
              cause={JSON.parse(selectedRow.cause)}
            />
          ) : selectedRow.source === "Slack" ? (
            <SlackMessage
              data={JSON.parse(selectedRow.body)}
              cause={selectedRow.cause}
            />
          ) : selectedRow.source === "Github" ? (
            <GithubNotification
              data={JSON.parse(selectedRow.body)}
              event={selectedRow.title
                .split(" ")
                .slice(0, selectedRow.title.split(" ").length - 1)
                .join("_")
                .toLocaleLowerCase()}
              cause={selectedRow.cause}
              timestamp={selectedRow.created_at}
            />
          ) : (
            <div className="col-span-2 max-h-[600px] overflow-y-scroll p-1">
              {body}
            </div>
          )}
        </div>
        {/* reply box */}
        {/* actions */}
        <div className="mt-6 flex justify-between">
          <div className="flex">
            <Button
              className="mr-2 text-servcy-black hover:!border-servcy-wheat hover:!text-servcy-wheat"
              onClick={() =>
                selectedRowIndex > 0 &&
                setSelectedRowIndex(selectedRowIndex - 1)
              }
              disabled={selectedRowIndex === 0}
              shape="circle"
              icon={<FaAngleDoubleLeft className="my-auto" />}
            />
            <Button
              className="text-servcy-black hover:!border-servcy-wheat hover:!text-servcy-wheat"
              onClick={() =>
                selectedRowIndex < totalInboxItems - 1 &&
                setSelectedRowIndex(selectedRowIndex + 1)
              }
              disabled={selectedRowIndex === totalInboxItems - 1}
              icon={<FaAngleDoubleRight className="my-auto" />}
              shape="circle"
            />
          </div>
          <Button
            type="primary"
            className="bg-servcy-black hover:!bg-servcy-wheat hover:!text-servcy-black"
            icon={<FaReply />}
            shape="round"
            disabled={activeTab === "notification"}
          >
            Reply
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default InboxItemModal;

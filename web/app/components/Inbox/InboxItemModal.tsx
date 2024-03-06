
import * as DOMPurify from "dompurify";

import { Button, Modal } from "antd";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { HiPaperClip } from "react-icons/hi";
import AsanaNotification from "./AsanaNotification";
import FigmaNotification from "./FigmaNotification";
import GithubNotification from "./GithubNotification";
import JiraNotification from "./JiraNotification";
import NotionComment from "./NotionComment";
import SlackMessage from "./SlackMessage";
import TrelloNotification from "./TrelloNotification";

import { Attachment, InboxItem } from "@/types/apps/inbox";

import { downloadFile } from "@/utils/Shared/files";

const InboxItemModal = ({
  selectedRow,
  setIsInboxItemModalVisible,
  selectedRowIndex,
  setSelectedRowIndex,
  totalInboxItems,
  readItem,
}: {
  selectedRow: InboxItem;
  setIsInboxItemModalVisible: (value: boolean) => void;
  selectedRowIndex: number;
  setSelectedRowIndex: (value: number) => void;
  totalInboxItems: number;
  readItem: (id: string | undefined) => void;
}) => {
  let body = selectedRow.body;
  if (selectedRow.source === "Gmail" && selectedRow.cause !== "None") {
    body = Buffer.from(body, "base64").toString("utf8");
  }
  if (selectedRow.is_body_html && selectedRow.cause !== "None") {
    body = DOMPurify.sanitize(body);
  }
  if (selectedRow.source === "Gmail" && selectedRow.cause !== "None" && body.includes("�")) body = selectedRow.body;

  return (
    <Modal
      open={true}
      title={selectedRow.title}
      onCancel={() => setIsInboxItemModalVisible(false)}
      footer={false}
      width="70vw"
    >
      <div>
        {/* body */}
        <div className="grid grid-cols-1">
          <div className="border-1 mt-2 rounded-lg border-servcy-black shadow-sm">
            {selectedRow.is_body_html ? (
              <>
                <div
                  dangerouslySetInnerHTML={{
                    __html: body,
                  }}
                  className="max-h-[600px] min-h-48 overflow-y-scroll p-1"
                />
                {selectedRow.attachments !== "None" && selectedRow.attachments !== "[]" && (
                  <div className="mt-4 flex overflow-x-scroll bg-servcy-black p-4">
                    {JSON.parse(selectedRow.attachments.replaceAll("'", '"')).map((attachment: Attachment) => (
                      <button
                        key={attachment.name}
                        onClick={() => {
                          downloadFile(attachment.name, attachment.data);
                        }}
                        className="mr-2 flex rounded-xl bg-servcy-silver p-3 text-servcy-cream hover:cursor-pointer"
                      >
                        <HiPaperClip className="mr-1 inline" size="18" />
                        <span className="truncate">{attachment.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : selectedRow.source === "Notion" ? (
              <NotionComment data={JSON.parse(selectedRow.body)} cause={selectedRow.cause} />
            ) : selectedRow.source === "Figma" ? (
              <FigmaNotification data={JSON.parse(selectedRow.body)} cause={selectedRow.cause} />
            ) : selectedRow.source === "Asana" ? (
              <AsanaNotification data={JSON.parse(selectedRow.body)} cause={JSON.parse(selectedRow.cause)} />
            ) : selectedRow.source === "Trello" ? (
              <TrelloNotification data={JSON.parse(selectedRow.body)} cause={JSON.parse(selectedRow.cause)} />
            ) : selectedRow.source === "Jira" ? (
              <JiraNotification data={JSON.parse(selectedRow.body)} cause={JSON.parse(selectedRow.cause)} />
            ) : selectedRow.source === "Slack" ? (
              <SlackMessage data={JSON.parse(selectedRow.body)} cause={selectedRow.cause} />
            ) : selectedRow.source === "Github" ? (
              <GithubNotification
                data={JSON.parse(selectedRow.body)}
                cause={selectedRow.cause}
                timestamp={selectedRow.created_at}
              />
            ) : (
              <div className="col-span-2 max-h-[600px] overflow-y-scroll p-1">{body}</div>
            )}
          </div>
        </div>
        {/* actions */}
        <div className="mt-8 flex justify-between">
          <div className="flex">
            <Button
              className="mr-2 text-servcy-black hover:!border-servcy-wheat hover:!text-servcy-wheat"
              onClick={() => {
                selectedRowIndex > 0 && setSelectedRowIndex(selectedRowIndex - 1);
                !selectedRow.is_read && readItem(selectedRow.id);
              }}
              disabled={selectedRowIndex === 0}
              shape="circle"
              icon={<FaAngleDoubleLeft className="mt-1" />}
            />
            <Button
              className="text-servcy-black hover:!border-servcy-wheat hover:!text-servcy-wheat"
              onClick={() => {
                selectedRowIndex < totalInboxItems - 1 && setSelectedRowIndex(selectedRowIndex + 1);
                !selectedRow.is_read && readItem(selectedRow.id);
              }}
              disabled={selectedRowIndex === totalInboxItems - 1}
              icon={<FaAngleDoubleRight className="mt-1" />}
              shape="circle"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default InboxItemModal;

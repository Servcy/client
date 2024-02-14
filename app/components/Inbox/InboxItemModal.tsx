"use client";

// dependencies
import cn from "classnames";
import * as DOMPurify from "dompurify";
import { useState } from "react";
// Compponents
import UploadButton from "@/components/Shared/uploadButton";
import { Button, Modal, Popover, Tooltip } from "antd";
import { AiFillCloseCircle, AiOutlineSend } from "react-icons/ai";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaReply } from "react-icons/fa";
import { HiPaperClip } from "react-icons/hi";
import { RxMagicWand } from "react-icons/rx";
import AsanaNotification from "./AsanaNotification";
import FigmaNotification from "./FigmaNotification";
import GithubNotification from "./GithubNotification";
import NotionComment from "./NotionComment";
import SlackMessage from "./SlackMessage";
import TrelloNotification from "./TrelloNotification";
// Types
import { Attachment, InboxItem } from "@/types/inbox";
import type { RcFile } from "antd/es/upload/interface";
// APIs
import {
  generateReply as generateReplyApi,
  sendReply as sendReplyApi,
} from "@/apis/inbox";
import { toast } from "react-hot-toast";
// Utils
import { downloadFile } from "@/utils/Shared/files";
import { BiSolidTrash } from "react-icons/bi";

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
  if (selectedRow.source === "Gmail" && selectedRow.cause !== "None") {
    body = Buffer.from(body, "base64").toString("utf8");
  }
  if (selectedRow.is_body_html && selectedRow.cause !== "None") {
    body = DOMPurify.sanitize(body);
  }
  if (
    selectedRow.source === "Gmail" &&
    selectedRow.cause !== "None" &&
    body.includes("�")
  )
    body = selectedRow.body;
  const [isReplyBoxVisible, setIsReplyBoxVisible] = useState<boolean>(false);
  const [reply, setReply] = useState<string>("");
  const [generatingReply, setGeneratingReply] = useState<boolean>(false);
  const [fileList, setFileList] = useState<number[]>([]);
  const [fileNameIdMap, setFileNameIdMap] = useState<Record<string, number>>(
    {}
  );
  const [removedFiles, setRemovedFiles] = useState<string[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [sendingReply, setSendingReply] = useState<boolean>(false);

  const generateReply = async () => {
    try {
      setGeneratingReply(true);
      const reply = await generateReplyApi({
        input_text: body,
        input_type: ["Gmail", "Outlook"].includes(selectedRow.source)
          ? "email"
          : "message",
      });
      setReply(reply);
    } catch {
      toast.error("Something went wrong, please try again later");
    } finally {
      setGeneratingReply(false);
    }
  };

  const sendReply = async () => {
    try {
      setSendingReply(true);
      await sendReplyApi({
        body: !selectedRow.is_body_html ? body : selectedRow.uid,
        reply,
        is_body_html: selectedRow.is_body_html,
        user_integration_id: selectedRow.user_integration_id,
        file_ids: fileList,
        removed_file_ids: removedFiles,
      });
      toast.success("Reply sent successfully");
      setReply("");
      setIsReplyBoxVisible(false);
      setFileList([]);
      setRemovedFiles([]);
      setFileNameIdMap({});
      setIsInboxItemModalVisible(false);
    } catch (err: any) {
      if (err?.response?.status === 400) {
        toast.error(
          err.response?.data?.detail ||
            "Something went wrong, please try again later"
        );
      } else toast.error("Something went wrong, please try again later");
    } finally {
      setSendingReply(false);
    }
  };

  const beforeFileUpload = (file: RcFile) => {
    const isFileSmallerThan30M = file.size / 1024 / 1024 < 30;
    if (!isFileSmallerThan30M) {
      toast.error("Image must smaller than 30MB!");
    }
    return isFileSmallerThan30M;
  };

  const content = (
    <div>
      {fileList.length !== 0 ? (
        <ul>
          {fileList.map((id) => (
            <li key={id}>
              <div className="flex justify-between">
                <div className="truncate">
                  {Object.entries(fileNameIdMap).find(
                    ([_, value]) => value === id
                  )?.[0] ?? id.toString()}
                </div>
                <BiSolidTrash
                  className="ml-2 cursor-pointer text-red-400"
                  onClick={() => {
                    setFileList(fileList.filter((fileId) => fileId !== id));
                    setRemovedFiles([...removedFiles, id.toString()]);
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div>None added yet.</div>
      )}
    </div>
  );

  return (
    <Modal
      open={true}
      title={selectedRow.title}
      onCancel={() => setIsInboxItemModalVisible(false)}
      footer={false}
      width={isReplyBoxVisible ? "90vw" : "70vw"}
    >
      <div>
        {/* body */}
        <div
          className={cn("grid", {
            "grid-cols-1": !isReplyBoxVisible,
            "grid-cols-3 gap-2": isReplyBoxVisible,
          })}
        >
          <div
            className={cn(
              "border-1 mt-2 rounded-lg border-servcy-black shadow-sm",
              {
                "col-span-2": isReplyBoxVisible,
              }
            )}
          >
            {selectedRow.is_body_html ? (
              <>
                <div
                  dangerouslySetInnerHTML={{
                    __html: body,
                  }}
                  className="max-h-[600px] min-h-48 overflow-y-scroll p-1"
                />
                {selectedRow.attachments !== "None" &&
                  selectedRow.attachments !== "[]" && (
                    <div className="mt-4 flex overflow-x-scroll bg-servcy-black p-4">
                      {JSON.parse(
                        selectedRow.attachments.replaceAll("'", '"')
                      ).map((attachment: Attachment) => (
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
          {isReplyBoxVisible && (
            <div className="border-1 relative mt-2 rounded-lg border-servcy-black shadow-sm">
              <textarea
                className="h-full w-full resize-none rounded-lg p-2 !outline-none selection:!bg-servcy-wheat selection:!text-servcy-black"
                placeholder="Write a reply..."
                onChange={(e) => setReply(e.target.value)}
                value={reply}
                maxLength={500}
                disabled={generatingReply}
                id="replyBox"
              />
              <div className="absolute bottom-2 right-2 float-right text-xs">
                <span id="current">{reply.length}</span>
                <span id="maximum">/ 500</span>
              </div>
              <Tooltip title="Generate a reply using AI">
                <Button
                  className="absolute bottom-8 right-2  ml-2 bg-servcy-black hover:!bg-servcy-wheat hover:!text-servcy-black"
                  icon={<RxMagicWand className="mt-1" />}
                  shape="circle"
                  loading={generatingReply}
                  type="primary"
                  onClick={() => {
                    generateReply();
                  }}
                ></Button>
              </Tooltip>
              {activeTab === "message" && (
                <UploadButton
                  beforeUpload={beforeFileUpload}
                  onSave={(data, fileName) => {
                    const fileIds = JSON.parse(data.results).file_ids;
                    setFileList((prevState) => [...prevState, ...fileIds]);
                    setFileNameIdMap((prevState) => ({
                      ...prevState,
                      [fileName]: fileIds[0],
                    }));
                  }}
                  showUploadList={false}
                  onRemove={(file: any) => {
                    const fileName = file.name;
                    const fileId = fileNameIdMap[fileName];
                    setFileList((prevState) =>
                      prevState.filter((id) => id !== fileId)
                    );
                    fileId &&
                      setRemovedFiles([...removedFiles, fileId.toString()]);
                  }}
                  setUploading={setUploading}
                >
                  <Popover
                    placement="leftBottom"
                    title={<span>Attachments</span>}
                    content={content}
                  >
                    <Tooltip title="Add an attachment" placement="bottom">
                      <Button
                        className="absolute bottom-8 right-12 ml-2 bg-servcy-black hover:!bg-servcy-wheat hover:!text-servcy-black"
                        icon={<HiPaperClip className="mt-1" />}
                        shape="circle"
                        type="primary"
                        loading={uploading}
                      ></Button>
                    </Tooltip>
                  </Popover>
                </UploadButton>
              )}
            </div>
          )}
        </div>
        {/* actions */}
        <div className="mt-8 flex justify-between">
          <div className="flex">
            <Button
              className="mr-2 text-servcy-black hover:!border-servcy-wheat hover:!text-servcy-wheat"
              onClick={() =>
                selectedRowIndex > 0 &&
                setSelectedRowIndex(selectedRowIndex - 1)
              }
              disabled={selectedRowIndex === 0}
              shape="circle"
              icon={<FaAngleDoubleLeft className="mt-1" />}
            />
            <Button
              className="text-servcy-black hover:!border-servcy-wheat hover:!text-servcy-wheat"
              onClick={() =>
                selectedRowIndex < totalInboxItems - 1 &&
                setSelectedRowIndex(selectedRowIndex + 1)
              }
              disabled={selectedRowIndex === totalInboxItems - 1}
              icon={<FaAngleDoubleRight className="mt-1" />}
              shape="circle"
            />
          </div>
          {!isReplyBoxVisible ? (
            <Button
              type="primary"
              className="bg-servcy-black hover:!bg-servcy-wheat hover:!text-servcy-black"
              icon={<FaReply />}
              shape="round"
              disabled={activeTab === "notification"}
              onClick={() => setIsReplyBoxVisible(true)}
            >
              Reply
            </Button>
          ) : (
            <div>
              <Button
                className="mr-2 hover:!border-servcy-wheat hover:!text-servcy-wheat"
                icon={<AiFillCloseCircle />}
                shape="round"
                disabled={activeTab === "notification"}
                onClick={() => setIsReplyBoxVisible(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-servcy-black hover:!bg-servcy-wheat hover:!text-servcy-black"
                icon={<AiOutlineSend />}
                shape="round"
                type="primary"
                loading={sendingReply}
                disabled={
                  reply.length === 0 ||
                  reply.length > 500 ||
                  generatingReply ||
                  uploading
                }
                onClick={() => {
                  sendReply();
                }}
              >
                Send
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default InboxItemModal;

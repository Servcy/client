"use client";

import { TrelloNotificationProps } from "@/types/trello";
import { HiExternalLink } from "react-icons/hi";
import { remark } from "remark";
import html from "remark-html";

const TrelloNotification = ({ data, cause }: TrelloNotificationProps) => {
  let link = "#null";
  let linkLabel = "";
  const { fullName } = cause;

  const renderTrelloEvent = () => {
    switch (data.type) {
      case "createBoard": {
        linkLabel = "View board on Trello";
        link = `https://trello.com/b/${data.data.board.shortLink}`;
        return (
          <>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Board Name:
              </div>
              <div>{data.data.board.name}</div>
            </div>
            {data.data.board.desc && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Description:
                </div>
                <div
                  className="border-1 max-w-[500px] overflow-scroll rounded-lg border-servcy-wheat p-1"
                  dangerouslySetInnerHTML={{
                    __html: remark()
                      .use(html)
                      .processSync(data.data.board.desc)
                      .toString(),
                  }}
                />
              </div>
            )}
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Status:
              </div>
              <div>{data.data.board.closed ? "Closed" : "Open"}</div>
            </div>
          </>
        );
      }
      case "updateBoard": {
        linkLabel = "View board on Trello";
        link = `https://trello.com/b/${data.data.board.shortLink}`;
        return (
          <>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Board Name:
              </div>
              <div>{data.data.board.name}</div>
            </div>
            {data.data.board.desc && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Description:
                </div>
                <div
                  className="border-1 max-w-[500px] overflow-scroll rounded-lg border-servcy-wheat p-1"
                  dangerouslySetInnerHTML={{
                    __html: remark()
                      .use(html)
                      .processSync(data.data.board.desc)
                      .toString(),
                  }}
                />
              </div>
            )}
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Status:
              </div>
              <div>{data.data.board.closed ? "Closed" : "Open"}</div>
            </div>
            {data.data.old && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Fields Updated:
                </div>
                <div>
                  {Object.keys(data.data.old).map((field) => (
                    <div key={field}>{field}</div>
                  ))}
                </div>
              </div>
            )}
          </>
        );
      }
      // case "convertToCardFromCheckItem": {
      //   linkLabel = "View card on Trello";
      //   link = `https://trello.com/c/${data.data.card.shortLink}`;
      //   return (
      //     <>
      //       <div className="mb-2 flex w-full">
      //         <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
      //           Card Name:
      //         </div>
      //         <div>{data.data.card.name}</div>
      //       </div>
      //       <div className="mb-2 flex w-full">
      //         <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
      //           Checklist Name:
      //         </div>
      //         <div>{data.data.checklist.name}</div>
      //       </div>
      //     </>
      //   );
      // }
      default:
        return <div>Event not supported yet.</div>;
    }
  };

  return (
    <div className="col-span-2 max-h-[600px] overflow-y-scroll rounded-l-lg bg-servcy-black p-4 text-servcy-white">
      <div className="mb-4 min-h-[75px] text-servcy-white">
        {renderTrelloEvent()}
      </div>
      <div className="flex justify-between">
        {linkLabel && (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="text-servcy-wheat hover:text-servcy-silver hover:underline"
          >
            <HiExternalLink className="mr-1 inline" size="18" />
            {linkLabel}
          </a>
        )}

        <div className="flex flex-col text-xs text-servcy-wheat">
          <div className="mb-2 flex-row">{fullName}</div>
          <div className="flex-row">
            {new Date(data.date).toLocaleString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrelloNotification;

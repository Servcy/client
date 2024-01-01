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
        link = data.data.board
          ? `https://trello.com/b/${data.data.board.shortLink}`
          : "#null";
        return (
          data.data.board && (
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
          )
        );
      }
      case "updateBoard": {
        linkLabel = "View board on Trello";
        link = data.data.board
          ? `https://trello.com/b/${data.data.board.shortLink}`
          : "#null";
        return (
          data.data.board && (
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
          )
        );
      }
      case "convertToCardFromCheckItem": {
        linkLabel = "View card on Trello";
        link = data.data.card
          ? `https://trello.com/c/${data.data.card.shortLink}`
          : "#null";
        return (
          <>
            {data.data.card && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Card Name:
                </div>
                <div>{data.data.card.name}</div>
              </div>
            )}
            {data.data.checklist && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Checklist Name:
                </div>
                <div>{data.data.checklist.name}</div>
              </div>
            )}
            {data.data.cardSource && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Source Card:
                </div>
                <div>
                  {data.data.cardSource.name}{" "}
                  <a
                    href={data.data.cardSource.shortLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <HiExternalLink
                      className="my-auto inline text-servcy-silver hover:text-servcy-wheat"
                      size="18"
                    />
                  </a>
                </div>
              </div>
            )}
            {data.data.board && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Board:
                </div>
                <div>
                  {data.data.board.name}{" "}
                  <a
                    href={data.data.board.shortLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <HiExternalLink
                      className="my-auto inline text-servcy-silver hover:text-servcy-wheat"
                      size="18"
                    />
                  </a>
                </div>
              </div>
            )}
            {data.data.list && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  List:
                </div>
                <div>{data.data.list.name}</div>
              </div>
            )}
          </>
        );
      }
      case "createCard": {
        linkLabel = "View card on Trello";
        link = data.data.card
          ? `https://trello.com/c/${data.data.card.shortLink}`
          : "#null";
        return (
          <>
            {data.data.card && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Card Name:
                </div>
                <div>{data.data.card.name}</div>
              </div>
            )}
            {data.data.card?.desc && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold">
                  Description:
                </div>
                <div
                  className="border-1 max-w-[500px] overflow-scroll rounded-lg border-servcy-wheat p-1"
                  dangerouslySetInnerHTML={{
                    __html: remark()
                      .use(html)
                      .processSync(data.data.card.desc)
                      .toString(),
                  }}
                />
              </div>
            )}
            {data.data.list && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  List:
                </div>
                <div>{data.data.list.name}</div>
              </div>
            )}
            {data.data.board && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Board:
                </div>
                <div>
                  {data.data.board.name}
                  <a
                    href={data.data.board.shortLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <HiExternalLink
                      className="my-auto inline text-servcy-silver hover:text-servcy-wheat"
                      size="18"
                    />
                  </a>
                </div>
              </div>
            )}
          </>
        );
      }
      case "updateCard": {
        linkLabel = "View card on Trello";
        link = data.data.card
          ? `https://trello.com/c/${data.data.card.shortLink}`
          : "#null";
        return (
          <>
            {data.data.card && (
              <>
                <div className="mb-2 flex w-full">
                  <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                    Card Name:
                  </div>
                  <div>{data.data.card.name}</div>
                </div>
                {data.data.card.desc && (
                  <div className="mb-2 flex w-full">
                    <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                      Description:
                    </div>
                    <div
                      className="border-1 max-w-[500px] overflow-scroll rounded-lg border-servcy-wheat p-1"
                      dangerouslySetInnerHTML={{
                        __html: remark()
                          .use(html)
                          .processSync(data.data.card.desc)
                          .toString(),
                      }}
                    />
                  </div>
                )}
                {data.data.list && (
                  <div className="mb-2 flex w-full">
                    <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                      List:
                    </div>
                    <div>{data.data.list.name}</div>
                  </div>
                )}
                {data.data.board && (
                  <div className="mb-2 flex w-full">
                    <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                      Board:
                    </div>
                    <div>
                      {data.data.board.name}
                      <a
                        href={data.data.board.shortLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <HiExternalLink
                          className="my-auto inline text-servcy-silver hover:text-servcy-wheat"
                          size="18"
                        />
                      </a>
                    </div>
                  </div>
                )}
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
            )}
          </>
        );
      }
      case "addChecklistToCard": {
        linkLabel = "View card on Trello";
        link = data.data.card
          ? `https://trello.com/c/${data.data.card.shortLink}`
          : "#null";
        return (
          <>
            {data.data.card && (
              <>
                <div className="mb-2 flex w-full">
                  <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                    Card Name:
                  </div>
                  <div>{data.data.card.name}</div>
                </div>
                {data.data.checklist && (
                  <div className="mb-2 flex w-full">
                    <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                      Checklist Name:
                    </div>
                    <div>{data.data.checklist.name}</div>
                  </div>
                )}
                {data.data.board && (
                  <div className="mb-2 flex w-full">
                    <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                      Board:
                    </div>
                    <div>
                      {data.data.board.name}{" "}
                      <a
                        href={data.data.board.shortLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <HiExternalLink
                          className="my-auto inline text-servcy-silver hover:text-servcy-wheat"
                          size="18"
                        />
                      </a>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        );
      }
      case "createCheckItem": {
        linkLabel = "View card on Trello";
        link = data.data.card
          ? `https://trello.com/c/${data.data.card.shortLink}`
          : "#null";
        return (
          <>
            {data.data.card && (
              <>
                <div className="mb-2 flex w-full">
                  <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                    Card Name:
                  </div>
                  <div>{data.data.card.name}</div>
                </div>
                {data.data.checkItem && (
                  <>
                    <div className="mb-2 flex w-full">
                      <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                        Check Item Name:
                      </div>
                      <div>{data.data.checkItem.name}</div>
                    </div>
                    <div className="mb-2 flex w-full">
                      <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                        Check Item State:
                      </div>
                      <div>{data.data.checkItem.state}</div>
                    </div>
                  </>
                )}
                {data.data.checklist && (
                  <div className="mb-2 flex w-full">
                    <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                      Checklist Name:
                    </div>
                    <div>{data.data.checklist.name}</div>
                  </div>
                )}
                {data.data.board && (
                  <div className="mb-2 flex w-full">
                    <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                      Board:
                    </div>
                    <div>
                      {data.data.board.name}{" "}
                      <a
                        href={data.data.board.shortLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <HiExternalLink
                          className="my-auto inline text-servcy-silver hover:text-servcy-wheat"
                          size="18"
                        />
                      </a>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        );
      }
      case "updateCheckItem": {
        linkLabel = "View card on Trello";
        link = data.data.card
          ? `https://trello.com/c/${data.data.card.shortLink}`
          : "#null";

        return (
          <>
            {data.data.card && (
              <>
                <div className="mb-2 flex w-full">
                  <div className="mr-2 w-[150px] font-mono font-semibold">
                    Card Name:
                  </div>
                  <div>{data.data.card.name}</div>
                </div>
                {data.data.checkItem && (
                  <>
                    <div className="mb-2 flex w-full">
                      <div className="mr-2 w-[150px] font-mono font-semibold">
                        Check Item Name:
                      </div>
                      <div>{data.data.checkItem.name}</div>
                    </div>
                    <div className="mb-2 flex w-full">
                      <div className="mr-2 w-[150px] font-mono font-semibold">
                        Check Item State:
                      </div>
                      <div>{data.data.checkItem.state}</div>
                    </div>
                  </>
                )}
                {data.data.checklist && (
                  <div className="mb-2 flex w-full">
                    <div className="mr-2 w-[150px] font-mono font-semibold">
                      Checklist Name:
                    </div>
                    <div>{data.data.checklist.name}</div>
                  </div>
                )}
                {data.data.board && (
                  <div className="mb-2 flex w-full">
                    <div className="mr-2 w-[150px] font-mono font-semibold">
                      Board:
                    </div>
                    <div>
                      {data.data.board.name}{" "}
                      <a
                        href={data.data.board.shortLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <HiExternalLink
                          className="my-auto inline text-servcy-silver hover:text-servcy-wheat"
                          size="18"
                        />
                      </a>
                    </div>
                  </div>
                )}
                {data.data.old && (
                  <div className="mb-2 flex w-full">
                    <div className="mr-2 w-[150px] font-mono font-semibold">
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
            )}
          </>
        );
      }
      case "deleteCheckItem": {
        linkLabel = "View card on Trello";
        link = data.data.card
          ? `https://trello.com/c/${data.data.card.shortLink}`
          : "#null";
        return (
          <>
            {data.data.card && (
              <>
                <div className="mb-2 flex w-full">
                  <div className="mr-2 w-[150px] font-mono font-semibold">
                    Card Name:
                  </div>
                  <div>{data.data.card.name}</div>
                </div>
                {data.data.checkItem && (
                  <>
                    <div className="mb-2 flex w-full">
                      <div className="mr-2 w-[150px] font-mono font-semibold">
                        Check Item Name:
                      </div>
                      <div>{data.data.checkItem.name}</div>
                    </div>
                    <div className="mb-2 flex w-full">
                      <div className="mr-2 w-[150px] font-mono font-semibold">
                        Check Item State:
                      </div>
                      <div>{data.data.checkItem.state}</div>
                    </div>
                  </>
                )}
                {data.data.checklist && (
                  <div className="mb-2 flex w-full">
                    <div className="mr-2 w-[150px] font-mono font-semibold">
                      Checklist Name:
                    </div>
                    <div>{data.data.checklist.name}</div>
                  </div>
                )}
                {data.data.board && (
                  <div className="mb-2 flex w-full">
                    <div className="mr-2 w-[150px] font-mono font-semibold">
                      Board:
                    </div>
                    <div>
                      {data.data.board.name}{" "}
                      <a
                        href={data.data.board.shortLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <HiExternalLink
                          className="my-auto inline text-servcy-silver hover:text-servcy-wheat"
                          size="18"
                        />
                      </a>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        );
      }
      case "removeChecklistFromCard": {
        linkLabel = "View card on Trello";
        link = data.data.card
          ? `https://trello.com/c/${data.data.card.shortLink}`
          : "#null";
        return (
          <>
            {data.data.card && (
              <>
                <div className="mb-2 flex w-full">
                  <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                    Card Name:
                  </div>
                  <div>{data.data.card.name}</div>
                </div>
                {data.data.checklist && (
                  <div className="mb-2 flex w-full">
                    <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                      Checklist Name:
                    </div>
                    <div>{data.data.checklist.name}</div>
                  </div>
                )}
                {data.data.board && (
                  <div className="mb-2 flex w-full">
                    <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                      Board:
                    </div>
                    <div>
                      {data.data.board.name}{" "}
                      <a
                        href={data.data.board.shortLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <HiExternalLink
                          className="my-auto inline text-servcy-silver hover:text-servcy-wheat"
                          size="18"
                        />
                      </a>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        );
      }
      case "updateCheckItemStateOnCard": {
        linkLabel = "View card on Trello";
        link = data.data.card
          ? `https://trello.com/c/${data.data.card.shortLink}`
          : "#null";
        return (
          <>
            {data.data.card && (
              <>
                <div className="mb-2 flex w-full">
                  <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                    Card Name:
                  </div>
                  <div>{data.data.card.name}</div>
                </div>
                {data.data.checkItem && (
                  <>
                    <div className="mb-2 flex w-full">
                      <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                        Check Item Name:
                      </div>
                      <div>{data.data.checkItem.name}</div>
                    </div>
                    <div className="mb-2 flex w-full">
                      <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                        Check Item State:
                      </div>
                      <div>{data.data.checkItem.state}</div>
                    </div>
                  </>
                )}
                {data.data.checklist && (
                  <div className="mb-2 flex w-full">
                    <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                      Checklist Name:
                    </div>
                    <div>{data.data.checklist.name}</div>
                  </div>
                )}
                {data.data.board && (
                  <div className="mb-2 flex w-full">
                    <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                      Board:
                    </div>
                    <div>
                      {data.data.board.name}{" "}
                      <a
                        href={data.data.board.shortLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <HiExternalLink
                          className="my-auto inline text-servcy-silver hover:text-servcy-wheat"
                          size="18"
                        />
                      </a>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        );
      }
      case "updateCheckList": {
        linkLabel = "View card on Trello";
        link = data.data.card
          ? `https://trello.com/c/${data.data.card.shortLink}`
          : "#null";
        return (
          <>
            {data.data.checklist && (
              <>
                <div className="mb-2 flex w-full">
                  <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                    Checklist Name:
                  </div>
                  <div>{data.data.checklist.name}</div>
                </div>
                {data.data.board && (
                  <div className="mb-2 flex w-full">
                    <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                      Board:
                    </div>
                    <div>
                      {data.data.board.name}{" "}
                      <a
                        href={data.data.board.shortLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <HiExternalLink
                          className="my-auto inline text-servcy-silver hover:text-servcy-wheat"
                          size="18"
                        />
                      </a>
                    </div>
                  </div>
                )}
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
            )}
          </>
        );
      }
      case "updateList": {
        return (
          <>
            {data.data.list && (
              <>
                <div className="mb-2 flex w-full">
                  <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                    List Name:
                  </div>
                  <div>{data.data.list.name}</div>
                </div>
                {data.data.board && (
                  <div className="mb-2 flex w-full">
                    <div className="mr-2 w-[150px] font-mono font-semibold">
                      Board:
                    </div>
                    <div>
                      {data.data.board.name}{" "}
                      <a
                        href={data.data.board.shortLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <HiExternalLink
                          className="my-auto inline text-servcy-silver hover:text-servcy-wheat"
                          size="18"
                        />
                      </a>
                    </div>
                  </div>
                )}
                {data.data.old && (
                  <div className="mb-2 flex w-full">
                    <div className="mr-2 w-[150px] font-mono font-semibold">
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
            )}
          </>
        );
      }
      case "addLabelToCard": {
        linkLabel = "View card on Trello";
        link = data.data.card
          ? `https://trello.com/c/${data.data.card.shortLink}`
          : "#null";
        return (
          <>
            {data.data.card && (
              <>
                <div className="mb-2 flex w-full">
                  <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                    Card Name:
                  </div>
                  <div>{data.data.card.name}</div>
                </div>
                {data.data.label && (
                  <>
                    <div className="mb-2 flex w-full">
                      <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                        Label Name:
                      </div>
                      <div>{data.data.label.name}</div>
                    </div>
                    <div className="mb-2 flex w-full">
                      <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                        Label Color:
                      </div>
                      <div>{data.data.label.color}</div>
                    </div>
                  </>
                )}
                {data.data.board && (
                  <div className="mb-2 flex w-full">
                    <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                      Board:
                    </div>
                    <div>
                      {data.data.board.name}{" "}
                      <a
                        href={data.data.board.shortLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <HiExternalLink
                          className="my-auto inline text-servcy-silver hover:text-servcy-wheat"
                          size="18"
                        />
                      </a>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        );
      }
      case "removeLabelFromCard": {
        linkLabel = "View card on Trello";
        link = data.data.card
          ? `https://trello.com/c/${data.data.card.shortLink}`
          : "#null";

        return (
          <>
            {data.data.card && (
              <>
                <div className="mb-2 flex w-full">
                  <div className="mr-2 w-[150px] font-mono font-semibold">
                    Card Name:
                  </div>
                  <div>{data.data.card.name}</div>
                </div>
                {data.data.label && (
                  <>
                    <div className="mb-2 flex w-full">
                      <div className="mr-2 w-[150px] font-mono font-semibold">
                        Label Name:
                      </div>
                      <div>{data.data.label.name}</div>
                    </div>
                    <div className="mb-2 flex w-full">
                      <div className="mr-2 w-[150px] font-mono font-semibold">
                        Label Color:
                      </div>
                      <div>{data.data.label.color}</div>
                    </div>
                  </>
                )}
                {data.data.board && (
                  <div className="mb-2 flex w-full">
                    <div className="mr-2 w-[150px] font-mono font-semibold">
                      Board:
                    </div>
                    <div>
                      {data.data.board.name}{" "}
                      <a
                        href={data.data.board.shortLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <HiExternalLink
                          className="my-auto inline text-servcy-silver hover:text-servcy-wheat"
                          size="18"
                        />
                      </a>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        );
      }
      case "addMemberToCard": {
        linkLabel = "View card on Trello";
        link = data.data.card
          ? `https://trello.com/c/${data.data.card.shortLink}`
          : "#null";

        return (
          <>
            {data.data.card && (
              <>
                <div className="mb-2 flex w-full">
                  <div className="mr-2 w-[150px] font-mono font-semibold">
                    Card Name:
                  </div>
                  <div>{data.data.card.name}</div>
                </div>
                {data.data.member && (
                  <>
                    <div className="mb-2 flex w-full">
                      <div className="mr-2 w-[150px] font-mono font-semibold">
                        Member Name:
                      </div>
                      <div>{data.data.member.name}</div>
                    </div>
                  </>
                )}
              </>
            )}
          </>
        );
      }
      case "addMemberToBoard": {
        linkLabel = "View board on Trello";
        link = data.data.board
          ? `https://trello.com/b/${data.data.board.shortLink}`
          : "#null";

        return (
          <>
            {data.data.board && (
              <>
                <div className="mb-2 flex w-full">
                  <div className="mr-2 w-[150px] font-mono font-semibold">
                    Board Name:
                  </div>
                  <div>{data.data.board.name}</div>
                </div>
                {data.data.member && (
                  <>
                    <div className="mb-2 flex w-full">
                      <div className="mr-2 w-[150px] font-mono font-semibold">
                        Member Name:
                      </div>
                      <div>{data.data.member.name}</div>
                    </div>
                  </>
                )}
              </>
            )}
          </>
        );
      }
      case "moveCardFromBoard": {
        linkLabel = "View card on Trello";
        link = data.data.card
          ? `https://trello.com/c/${data.data.card.shortLink}`
          : "#null";

        return (
          <>
            {data.data.card && (
              <>
                <div className="mb-2 flex w-full">
                  <div className="mr-2 w-[150px] font-mono font-semibold">
                    Card Name:
                  </div>
                  <div>{data.data.card.name}</div>
                </div>
                {data.data.board && (
                  <>
                    <div className="mb-2 flex w-full">
                      <div className="mr-2 w-[150px] font-mono font-semibold">
                        Source Board:
                      </div>
                      <div>
                        {data.data.board.name}{" "}
                        <a
                          href={data.data.board.shortLink}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <HiExternalLink
                            className="my-auto inline text-servcy-silver hover:text-servcy-wheat"
                            size="18"
                          />
                        </a>
                      </div>
                    </div>
                  </>
                )}
                {data.display.entities.board && (
                  <>
                    <div className="mb-2 flex w-full">
                      <div className="mr-2 w-[150px] font-mono font-semibold">
                        Target Board:
                      </div>
                      <div>
                        {data.display.entities.board.text}{" "}
                        <a
                          href={data.display.entities.board.shortLink}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <HiExternalLink
                            className="my-auto inline text-servcy-silver hover:text-servcy-wheat"
                            size="18"
                          />
                        </a>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </>
        );
      }
      case "moveCardToBoard": {
        linkLabel = "View board on Trello";
        link = data.data.board
          ? `https://trello.com/b/${data.data.board.shortLink}`
          : "#null";

        return (
          <>
            {data.data.board && (
              <>
                <div className="mb-2 flex w-full">
                  <div className="mr-2 w-[150px] font-mono font-semibold">
                    Board Name:
                  </div>
                  <div>{data.data.board.name}</div>
                </div>
                {data.data.card && (
                  <>
                    <div className="mb-2 flex w-full">
                      <div className="mr-2 w-[150px] font-mono font-semibold">
                        Card Name:
                      </div>
                      <div>
                        {data.data.card.name}{" "}
                        <a
                          href={data.data.card.shortLink}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <HiExternalLink
                            className="my-auto inline text-servcy-silver hover:text-servcy-wheat"
                            size="18"
                          />
                        </a>
                      </div>
                    </div>
                  </>
                )}
                {data.display.entities.board && (
                  <>
                    <div className="mb-2 flex w-full">
                      <div className="mr-2 w-[150px] font-mono font-semibold">
                        Source Board:
                      </div>
                      <div>
                        {data.display.entities.board.text}{" "}
                        <a
                          href={data.display.entities.board.shortLink}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <HiExternalLink
                            className="my-auto inline text-servcy-silver hover:text-servcy-wheat"
                            size="18"
                          />
                        </a>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </>
        );
      }
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

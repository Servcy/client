import { AsanaNotificationProps } from "@/types/asana";
import { getCleanLink } from "@/utils/Shared";
import { Avatar, Tag, Tooltip } from "antd";
import Image from "next/image";
import { HiExternalLink } from "react-icons/hi";
import { remark } from "remark";
import html from "remark-html";

const AsanaNotification = ({ data, cause }: AsanaNotificationProps) => {
  let link = "#null";
  let linkLabel = "";
  const { name, photo } = cause;
  const cleanImageLink = photo
    ? getCleanLink(
        photo.image_60x60 ?? photo.image_128x128 ?? photo.image_21x21 ?? ""
      )
    : "";

  const renderAsanaEvent = () => {
    if (data.comment) {
      link = `https://app.asana.com/0/0/${data.comment.target.gid}/${data.comment.gid}/f`;
      linkLabel = "View comment in Asana";
      return (
        <>
          <div className="mb-2 flex w-full">
            <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
              Comment:
            </div>
            <div
              className="border-1 servcy-link-inbox-item-comment max-w-[500px] overflow-scroll rounded-lg border-servcy-wheat p-1"
              dangerouslySetInnerHTML={{
                __html: remark()
                  .use(html)
                  .processSync(data.comment.text)
                  .toString(),
              }}
            />
          </div>
          <div className="mb-2 flex w-full">
            <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
              Action:
            </div>
            <div>
              <Tag className="m-1 bg-servcy-light font-bold text-servcy-white">
                {data.action.charAt(0).toUpperCase() + data.action.slice(1)}
              </Tag>
            </div>
          </div>
          <div className="mb-2 flex w-full">
            <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
              Task:
            </div>
            <div>{data.comment.target.name}</div>
          </div>
          <div className="mb-2 mt-4 flex w-full">
            <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
              Reactions:
            </div>
            <div className="text-xs font-semibold text-servcy-black">
              <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                👍 {data.comment.likes.length}
              </span>
              <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                ❤️ {data.comment.hearts.length}
              </span>
            </div>
          </div>
        </>
      );
    } else if (data.task) {
      link = data.task.permalink_url;
      linkLabel = "View task in Asana";
      return (
        <>
          <div className="mb-2 flex w-full">
            <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
              Task:
            </div>
            <div>{data.task.name}</div>
          </div>
          <div className="mb-2 flex w-full">
            <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
              Action:
            </div>
            <div>
              <Tag className="m-1 bg-servcy-light font-bold text-servcy-white">
                {data.action.charAt(0).toUpperCase() + data.action.slice(1)}
              </Tag>
            </div>
          </div>
          {data.task.notes && (
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Description:
              </div>
              <div
                className="border-1 servcy-link-inbox-item-comment max-w-[500px] overflow-scroll rounded-lg border-servcy-wheat p-1"
                dangerouslySetInnerHTML={{
                  __html: remark()
                    .use(html)
                    .processSync(data.task.notes)
                    .toString(),
                }}
              />
            </div>
          )}
          <div className="mb-2 mt-4 flex w-full">
            <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
              Reactions:
            </div>
            <div className="text-xs font-semibold text-servcy-black">
              <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                👍 {data.task.likes.length}
              </span>
              <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                ❤️ {data.task.hearts.length}
              </span>
            </div>
          </div>
          {data.task.assignee && (
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Assignee:
              </div>
              <div>{data.task.assignee.name}</div>
            </div>
          )}
          {data.task.completed_at && data.task.completed && (
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Completed At:
              </div>
              <div>
                {new Date(data.task.completed_at).toLocaleString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </div>
            </div>
          )}
          {data.task.due_on && (
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Due On:
              </div>
              <div>
                {new Date(data.task.due_on).toLocaleString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </div>
            </div>
          )}
          {data.task.due_at && (
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Due At:
              </div>
              <div>
                {new Date(data.task.due_at).toLocaleString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </div>
            </div>
          )}
          {data.task.followers && data.task.followers.length > 0 && (
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Followers:
              </div>
              <Avatar.Group
                maxCount={2}
                maxPopoverTrigger="click"
                size="small"
                maxStyle={{
                  color: "#2B3232",
                  backgroundColor: "#D1BFAE",
                  cursor: "pointer",
                }}
              >
                {data.task.followers.map((follower) => (
                  <Tooltip title={follower.name} key={follower.gid}>
                    <Avatar>{follower.name.charAt(0)}</Avatar>
                  </Tooltip>
                ))}
              </Avatar.Group>
            </div>
          )}
        </>
      );
    } else if (data.project) {
      link = data.project.permalink_url;
      linkLabel = "View project in Asana";
      return (
        <>
          <div className="mb-2 flex w-full">
            <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
              Project:
            </div>
            <div>{data.project.name}</div>
          </div>
          <div className="mb-2 flex w-full">
            <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
              Action:
            </div>
            <div>
              <Tag className="m-1 bg-servcy-light font-bold text-servcy-white">
                {data.action.charAt(0).toUpperCase() + data.action.slice(1)}
              </Tag>
            </div>
          </div>
          <div className="mb-2 flex w-full">
            <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
              Team:
            </div>
            <div>{data.project.team.name}</div>
          </div>
          <div className="mb-2 flex w-full">
            <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
              Is Public:
            </div>
            <div>{data.project.public ? "Yes" : "No"}</div>
          </div>
          <div className="mb-2 flex w-full">
            <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
              Is Archived:
            </div>
            <div>{data.project.archived ? "Yes" : "No"}</div>
          </div>
          {data.project.notes && (
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Description:
              </div>
              <div
                className="border-1 servcy-link-inbox-item-comment max-w-[500px] overflow-scroll rounded-lg border-servcy-wheat p-1"
                dangerouslySetInnerHTML={{
                  __html: remark()
                    .use(html)
                    .processSync(data.project.notes)
                    .toString(),
                }}
              />
            </div>
          )}
          {data.project.completed_at && data.project.completed && (
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Completed At:
              </div>
              <div>
                {new Date(data.project.completed_at).toLocaleString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </div>
            </div>
          )}
          {data.project.due_on && (
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Due On:
              </div>
              <div>
                {new Date(data.project.due_on).toLocaleString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </div>
            </div>
          )}
          {data.project.due_date && (
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Due At:
              </div>
              <div>
                {new Date(data.project.due_date).toLocaleString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </div>
            </div>
          )}
          {data.project.followers && data.project.followers.length > 0 && (
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Followers:
              </div>
              <Avatar.Group
                maxCount={2}
                maxPopoverTrigger="click"
                size="small"
                maxStyle={{
                  color: "#2B3232",
                  backgroundColor: "#D1BFAE",
                  cursor: "pointer",
                }}
              >
                {data.project.followers.map((follower) => (
                  <Tooltip title={follower.name} key={follower.gid}>
                    <Avatar>{follower.name.charAt(0)}</Avatar>
                  </Tooltip>
                ))}
              </Avatar.Group>
            </div>
          )}
          {data.project.members && data.project.members.length > 0 && (
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Members:
              </div>
              <Avatar.Group
                maxCount={2}
                maxPopoverTrigger="click"
                size="small"
                maxStyle={{
                  color: "#2B3232",
                  backgroundColor: "#D1BFAE",
                  cursor: "pointer",
                }}
              >
                {data.project.members.map((member) => (
                  <Tooltip title={member.name} key={member.gid}>
                    <Avatar>{member.name.charAt(0)}</Avatar>
                  </Tooltip>
                ))}
              </Avatar.Group>
            </div>
          )}
        </>
      );
    } else {
      return <div>Event not supported</div>;
    }
  };

  return (
    <div className="col-span-2 max-h-[600px] overflow-y-scroll rounded-l-lg bg-servcy-black p-4 text-servcy-white">
      <div className="mb-4 min-h-[75px] text-servcy-white">
        {renderAsanaEvent()}
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
          <div className="mb-2 flex-row">
            {cleanImageLink && (
              <Image
                src={cleanImageLink}
                alt={name}
                className="mr-2 inline h-5 w-5 rounded-full"
                loader={() => cleanImageLink}
                width={20}
                height={20}
              />
            )}
            {name}
          </div>
          <div className="flex-row">
            {new Date(data.created_at).toLocaleString("en-US", {
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

export default AsanaNotification;

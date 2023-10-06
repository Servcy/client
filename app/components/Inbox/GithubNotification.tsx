"use client";

import { GithubNotificationProps } from "@/types/github";
import { getCleanLink } from "@/utils/Shared";
import { Tag, Tooltip } from "antd";
import Image from "next/image";
import { BiRightArrowAlt } from "react-icons/bi";
import { HiExternalLink } from "react-icons/hi";
import { remark } from "remark";
import html from "remark-html";

const GithubNotification = ({
  data,
  cause,
  event,
  timestamp,
}: GithubNotificationProps) => {
  let link = "#null";
  let linkLabel = "View in Github";
  const { login, avatar_url } = JSON.parse(cause);
  const cleanImageLink = getCleanLink(avatar_url);

  const renderGithubEvent = () => {
    switch (event) {
      case "pull_request_review_thread": {
        link = data.thread?.comments[0]?.html_url ?? "#null";
        linkLabel = "View thread in Github";
        return (
          <>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Pull Request:
              </div>
              <div>
                {data.pull_request?.title} [#{data.pull_request?.number}]{" "}
                <a
                  href={data.pull_request?.html_url}
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
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                State:
              </div>
              <div>
                <Tag className="m-1 bg-servcy-wheat font-bold text-servcy-white">
                  {data.pull_request?.state}
                </Tag>
              </div>
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Action Taken:
              </div>
              <div>
                <Tag className="m-1 bg-servcy-light font-bold text-servcy-white">
                  {data.action.charAt(0).toUpperCase() + data.action.slice(1)}
                </Tag>
              </div>
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Labels:
              </div>
              <div>
                {data.pull_request?.labels?.map((label) => (
                  <Tag key={label.id} className="m-1" color={`#${label.color}`}>
                    {label.name.charAt(0).toUpperCase() + label.name.slice(1)}
                  </Tag>
                ))}
              </div>
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Thread:
              </div>
              <div
                className="border-1 max-w-[500px] overflow-scroll rounded-lg border-servcy-wheat p-1"
                dangerouslySetInnerHTML={{
                  __html: remark()
                    .use(html)
                    .processSync(data.thread?.comments[0]?.body)
                    .toString(),
                }}
              />
            </div>
          </>
        );
      }
      case "pull_request_review_comment": {
        link = data.comment?.html_url ?? "#null";
        linkLabel = "View comment in Github";
        return (
          <>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Pull Request:
              </div>
              <div>
                {data.pull_request?.title} [#{data.pull_request?.number}]{" "}
                <a
                  href={data.pull_request?.html_url}
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
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                State:
              </div>
              <div>
                <Tag className="m-1 bg-servcy-wheat font-bold text-servcy-white">
                  {data.pull_request?.state}
                </Tag>
              </div>
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Action Taken:
              </div>
              <div>
                <Tag className="m-1 bg-servcy-light font-bold text-servcy-white">
                  {data.action.charAt(0).toUpperCase() + data.action.slice(1)}
                </Tag>
              </div>
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Labels:
              </div>
              <div>
                {data.pull_request?.labels?.map((label) => (
                  <Tag key={label.id} className="m-1" color={`#${label.color}`}>
                    {label.name.charAt(0).toUpperCase() + label.name.slice(1)}
                  </Tag>
                ))}
              </div>
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Comment:
              </div>
              <div
                className="border-1 max-w-[500px] overflow-scroll rounded-lg border-servcy-wheat p-1"
                dangerouslySetInnerHTML={{
                  __html: remark()
                    .use(html)
                    .processSync(data.comment?.body)
                    .toString(),
                }}
              />
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Reactions:
              </div>
              <div className="text-xs font-semibold text-servcy-black">
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  👍 {data.comment?.reactions["+1"]}
                </span>
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  👎 {data.comment?.reactions["-1"]}
                </span>
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  😄 {data.comment?.reactions.laugh}
                </span>
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  🎉 {data.comment?.reactions.hooray}
                </span>
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  😕 {data.comment?.reactions.confused}
                </span>
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  ❤️ {data.comment?.reactions.heart}
                </span>
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  🚀 {data.comment?.reactions.rocket}
                </span>
                <span className="border-1 rounded-lg bg-servcy-white p-1">
                  👀 {data.comment?.reactions.eyes}
                </span>
              </div>
            </div>
          </>
        );
      }
      case "pull_request_review": {
        link = data.review?.html_url ?? "#null";
        linkLabel = "View review in Github";
        return (
          <>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Pull Request:
              </div>
              <div>
                {data.pull_request?.title} [#{data.pull_request?.number}]{" "}
                <a
                  href={data.pull_request?.html_url}
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
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                State:
              </div>
              <div>
                <Tag className="m-1 bg-servcy-wheat font-bold text-servcy-white">
                  {data.pull_request?.state}
                </Tag>
              </div>
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Action Taken:
              </div>
              <div>
                <Tag className="m-1 bg-servcy-light font-bold text-servcy-white">
                  {data.action.charAt(0).toUpperCase() + data.action.slice(1)}
                </Tag>
              </div>
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Labels:
              </div>
              <div>
                {data.pull_request?.labels?.map((label) => (
                  <Tag key={label.id} className="m-1" color={`#${label.color}`}>
                    {label.name.charAt(0).toUpperCase() + label.name.slice(1)}
                  </Tag>
                ))}
              </div>
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Review State:
              </div>
              <div>
                <Tag className="m-1 bg-servcy-light font-bold text-servcy-white">
                  {data.review?.state}
                </Tag>
              </div>
            </div>
            {data.review?.body && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Review comment:
                </div>
                <div
                  className="border-1 max-w-[500px] overflow-scroll rounded-lg border-servcy-wheat p-1"
                  dangerouslySetInnerHTML={{
                    __html: remark()
                      .use(html)
                      .processSync(data.review.body)
                      .toString(),
                  }}
                />
              </div>
            )}
          </>
        );
      }
      case "projects_v2": {
        link = `https://github.com/orgs/${data.organization.login}/projects/${data.projects_v2?.number}`;
        linkLabel = "View project in Github";
        return (
          <>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Project:
              </div>
              <div>
                {data.projects_v2?.title} [#{data.projects_v2?.number}]{" "}
              </div>
            </div>
            {data.projects_v2?.short_description && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Description:
                </div>
                <div>{data.projects_v2.short_description}</div>
              </div>
            )}
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Action Taken:
              </div>
              <div>
                <Tag className="m-1 bg-servcy-light font-bold text-servcy-white">
                  {data.action.charAt(0).toUpperCase() + data.action.slice(1)}
                </Tag>
              </div>
            </div>
            {data.projects_v2?.owner && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Owner:
                </div>
                <div>
                  <Image
                    src={data.projects_v2.owner.avatar_url}
                    alt={data.projects_v2.owner.login}
                    className="mr-2 inline h-5 w-5 rounded-full"
                    width={20}
                    height={20}
                    loader={() => data.projects_v2?.owner.avatar_url ?? "#null"}
                  />
                  {data.projects_v2.owner.login}
                </div>
              </div>
            )}
            {data.projects_v2?.creator && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Creator:
                </div>
                <div>
                  <Image
                    src={data.projects_v2.creator.avatar_url}
                    alt={data.projects_v2.creator.login}
                    className="mr-2 inline h-5 w-5 rounded-full"
                    width={20}
                    height={20}
                    loader={() =>
                      data.projects_v2?.creator.avatar_url ?? "#null"
                    }
                  />
                  {data.projects_v2.creator.login}
                </div>
              </div>
            )}
          </>
        );
      }
      case "projects_v2_item": {
        linkLabel = "";
        return (
          <>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                ContentType:
              </div>
              <div>
                {data.projects_v2_item?.content_type} [#
                {data.projects_v2_item?.id}]
              </div>
            </div>
            {data.projects_v2_item?.creator && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Creator:
                </div>
                <div>
                  <Image
                    src={data.projects_v2_item.creator.avatar_url}
                    alt={data.projects_v2_item.creator.login}
                    className="mr-2 inline h-5 w-5 rounded-full"
                    width={20}
                    height={20}
                    loader={() =>
                      data.projects_v2_item?.creator.avatar_url ?? "#null"
                    }
                  />
                  {data.projects_v2_item.creator.login}
                </div>
              </div>
            )}
          </>
        );
      }
      case "milestone": {
        link = data.milestone?.html_url ?? "#null";
        linkLabel = "View milestone in Github";
        return (
          <>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Milestone:
              </div>
              <div>
                {data.milestone?.title} [#
                {data.milestone?.number}]
              </div>
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Action Taken:
              </div>
              <div>
                <Tag className="m-1 bg-servcy-light font-bold text-servcy-white">
                  {data.action.charAt(0).toUpperCase() + data.action.slice(1)}
                </Tag>
              </div>
            </div>
            {data.milestone?.due_on && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Due On:
                </div>
                <div>
                  {new Date(
                    parseFloat(data.milestone.due_on) * 1000
                  ).toLocaleString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </div>
              </div>
            )}
            {data.milestone?.closed_at && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Due On:
                </div>
                <div>
                  {new Date(
                    parseFloat(data.milestone.closed_at) * 1000
                  ).toLocaleString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </div>
              </div>
            )}
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Issues Closed:
              </div>
              <div>{data.milestone?.closed_issues}</div>
            </div>
            {data.milestone?.description && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Description:
                </div>
                <div>{data.milestone.description}</div>
              </div>
            )}
            {data.milestone?.creator && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Creator:
                </div>
                <div>
                  <Image
                    src={data.milestone.creator.avatar_url}
                    alt={data.milestone.creator.login}
                    className="mr-2 inline h-5 w-5 rounded-full"
                    width={20}
                    height={20}
                    loader={() => data.milestone?.creator.avatar_url ?? "#null"}
                  />
                  {data.milestone.creator.login}
                </div>
              </div>
            )}
          </>
        );
      }
      case "issues": {
        link = data.issue?.html_url ?? "#null";
        linkLabel = "View issue in Github";
        return (
          <>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Issue:
              </div>
              <div>
                {data.issue?.title} [#
                {data.issue?.number}]
              </div>
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Action Taken:
              </div>
              <div>
                <Tag className="m-1 bg-servcy-light font-bold text-servcy-white">
                  {data.action.charAt(0).toUpperCase() + data.action.slice(1)}
                </Tag>
              </div>
            </div>
            {data.issue?.state && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  State:
                </div>
                <div>
                  <Tag className="m-1 bg-servcy-light font-bold text-servcy-white">
                    {data.issue.state.charAt(0).toUpperCase() +
                      data.issue.state.slice(1)}
                  </Tag>
                </div>
              </div>
            )}
            {data.issue?.closed_at && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Closed On:
                </div>
                <div>
                  {new Date(
                    parseFloat(data.issue.closed_at) * 1000
                  ).toLocaleString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </div>
              </div>
            )}
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Comments:
              </div>
              <div>{data.issue?.comments}</div>
            </div>
            {data.issue?.body && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Description:
                </div>
                <div
                  className="border-1 max-w-[500px] overflow-scroll rounded-lg border-servcy-wheat p-1"
                  dangerouslySetInnerHTML={{
                    __html: remark()
                      .use(html)
                      .processSync(data.issue.body)
                      .toString(),
                  }}
                />
              </div>
            )}
            {data.issue?.assignees && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Assignees:
                </div>
                <div>
                  {data.issue.assignees.map((assignee) => (
                    <Tooltip title={assignee.login} key={assignee.id}>
                      <Image
                        src={assignee.avatar_url}
                        alt={assignee.login}
                        className="mr-2 inline h-5 w-5 rounded-full"
                        width={20}
                        height={20}
                        loader={() => assignee.avatar_url}
                      />
                    </Tooltip>
                  ))}
                </div>
              </div>
            )}
            {data.issue?.labels && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Labels:
                </div>
                <div>
                  {data.issue.labels.map((label) => (
                    <Tag
                      key={label.id}
                      className="m-1"
                      color={`#${label.color}`}
                    >
                      {label.name.charAt(0).toUpperCase() + label.name.slice(1)}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
            {data.issue?.milestone && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Milestone:
                </div>
                <div>
                  <a
                    href={data.issue.milestone.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-servcy-wheat hover:text-servcy-silver hover:underline"
                  >
                    <HiExternalLink className="mr-1 inline" size="18" />
                    {data.issue.milestone.title}
                  </a>
                </div>
              </div>
            )}
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Reactions:
              </div>
              <div className="text-xs font-semibold text-servcy-black">
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  👍 {data.issue?.reactions["+1"]}
                </span>
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  👎 {data.issue?.reactions["-1"]}
                </span>
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  😄 {data.issue?.reactions.laugh}
                </span>
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  🎉 {data.issue?.reactions.hooray}
                </span>
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  😕 {data.issue?.reactions.confused}
                </span>
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  ❤️ {data.issue?.reactions.heart}
                </span>
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  🚀 {data.issue?.reactions.rocket}
                </span>
                <span className="border-1 rounded-lg bg-servcy-white p-1">
                  👀 {data.issue?.reactions.eyes}
                </span>
              </div>
            </div>
          </>
        );
      }
      case "issue_comment": {
        link = data.comment?.html_url ?? "#null";
        linkLabel = "View comment in Github";
        return (
          <>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Comment:
              </div>
              <div
                className="border-1 max-w-[500px] overflow-scroll rounded-lg border-servcy-wheat p-1"
                dangerouslySetInnerHTML={{
                  __html: remark()
                    .use(html)
                    .processSync(data.comment?.body)
                    .toString(),
                }}
              />
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Action Taken:
              </div>
              <div>
                <Tag className="m-1 bg-servcy-light font-bold text-servcy-white">
                  {data.action.charAt(0).toUpperCase() + data.action.slice(1)}
                </Tag>
              </div>
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Issue:
              </div>
              <div>
                {data.issue?.title} [#
                {data.issue?.number}]
              </div>
            </div>
            <div className="mb-2 mt-4 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Reactions:
              </div>
              <div className="text-xs font-semibold text-servcy-black">
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  👍 {data.comment?.reactions["+1"]}
                </span>
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  👎 {data.comment?.reactions["-1"]}
                </span>
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  😄 {data.comment?.reactions.laugh}
                </span>
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  🎉 {data.comment?.reactions.hooray}
                </span>
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  😕 {data.comment?.reactions.confused}
                </span>
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  ❤️ {data.comment?.reactions.heart}
                </span>
                <span className="border-1 mr-2 rounded-lg bg-servcy-white p-1">
                  🚀 {data.comment?.reactions.rocket}
                </span>
                <span className="border-1 rounded-lg bg-servcy-white p-1">
                  👀 {data.comment?.reactions.eyes}
                </span>
              </div>
            </div>
          </>
        );
      }
      case "pull_request": {
        link = data.pull_request?.html_url ?? "#null";
        linkLabel = "View PR in Github";
        return (
          <>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Pull Request:
              </div>
              <div>
                {data.pull_request?.title} [#{data.pull_request?.number}] [
                <a
                  href={data.pull_request?.diff_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-servcy-light hover:text-servcy-wheat"
                >
                  Diff
                  <HiExternalLink className="my-auto inline" size="18" />
                </a>
                ]&nbsp;[
                <a
                  href={data.pull_request?.patch_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-red-400 hover:text-servcy-wheat"
                >
                  Patch
                  <HiExternalLink className="my-auto inline" size="18" />
                </a>
                ]
              </div>
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Branch:
              </div>
              <div className="font-semibold">
                {data.pull_request?.base.ref}{" "}
                <BiRightArrowAlt className="inline" />{" "}
                {data.pull_request?.head.ref}
              </div>
            </div>
            {data.pull_request?.state && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  State:
                </div>
                <div>
                  <Tag className="m-1 bg-servcy-wheat font-bold text-servcy-white">
                    {data.pull_request.state.charAt(0).toUpperCase() +
                      data.pull_request.state.slice(1)}
                  </Tag>
                </div>
              </div>
            )}
            {data.pull_request?.draft && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Is Draft:
                </div>
                <div>✅</div>
              </div>
            )}
            {data.pull_request?.milestone && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Milestone:
                </div>
                <div>
                  <a
                    href={data.pull_request.milestone.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-servcy-wheat hover:text-servcy-silver hover:underline"
                  >
                    <HiExternalLink className="mr-1 inline" size="18" />
                    {data.pull_request.milestone.title} [#
                    {data.pull_request.milestone.number}]
                  </a>
                </div>
              </div>
            )}
            {data.pull_request?.issue_url && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Issue Url:
                </div>
                <div>
                  <a
                    href={data.pull_request.issue_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-servcy-wheat hover:text-servcy-silver hover:underline"
                  >
                    <HiExternalLink className="mr-1 inline" size="18" />
                    {data.pull_request.issue_url.slice(
                      data.pull_request.issue_url.length - 6
                    )}
                    ...
                  </a>
                </div>
              </div>
            )}
            {data.pull_request?.assignees && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Assignees:
                </div>
                <div>
                  {data.pull_request.assignees.map((assignee) => (
                    <Tooltip title={assignee.login} key={assignee.id}>
                      <Image
                        src={assignee.avatar_url}
                        alt={assignee.login}
                        className="mr-2 inline h-5 w-5 rounded-full"
                        width={20}
                        height={20}
                        loader={() => assignee.avatar_url}
                      />
                    </Tooltip>
                  ))}
                </div>
              </div>
            )}
            {data.pull_request?.requested_reviewers && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Reviewers:
                </div>
                <div>
                  {data.pull_request.requested_reviewers.map((reviewer) => (
                    <Tooltip title={reviewer.login} key={reviewer.id}>
                      <Image
                        src={reviewer.avatar_url}
                        alt={reviewer.login}
                        className="mr-2 inline h-5 w-5 rounded-full"
                        width={20}
                        height={20}
                        loader={() => reviewer.avatar_url}
                      />
                    </Tooltip>
                  ))}
                </div>
              </div>
            )}
            {data.pull_request?.merged_by && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Merged By:
                </div>
                <div>
                  <Tooltip title={data.pull_request.merged_by.login}>
                    <Image
                      src={data.pull_request.merged_by.avatar_url}
                      alt={data.pull_request.merged_by.login}
                      className="mr-2 inline h-5 w-5 rounded-full"
                      width={20}
                      height={20}
                      loader={() =>
                        data.pull_request?.merged_by.avatar_url ?? "#null"
                      }
                    />
                  </Tooltip>
                </div>
              </div>
            )}
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Action Taken:
              </div>
              <div>
                <Tag className="m-1 bg-servcy-light font-bold text-servcy-white">
                  {data.action.charAt(0).toUpperCase() + data.action.slice(1)}
                </Tag>
              </div>
            </div>
            {data.pull_request?.labels &&
              data.pull_request.labels.length > 0 && (
                <div className="mb-2 flex w-full">
                  <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                    Labels:
                  </div>
                  <div>
                    {data.pull_request.labels.map((label) => (
                      <Tag
                        key={label.id}
                        className="m-1"
                        color={`#${label.color}`}
                      >
                        {label.name.charAt(0).toUpperCase() +
                          label.name.slice(1)}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Comments:
              </div>
              <div>{data.pull_request?.comments}</div>
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Commits:
              </div>
              <div>{data.pull_request?.commits}</div>
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Additions:
              </div>
              <div className="text-servcy-light">
                + {data.pull_request?.additions}
              </div>
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Deletions:
              </div>
              <div className="text-red-400">
                - {data.pull_request?.deletions}
              </div>
            </div>
            <div className="mb-2 flex w-full">
              <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                Files Changed:
              </div>
              <div>{data.pull_request?.changed_files}</div>
            </div>
            {data.pull_request?.body && (
              <div className="mb-2 flex w-full">
                <div className="mr-2 w-[150px] font-mono font-semibold text-servcy-silver">
                  Body:
                </div>
                <div
                  className="border-1 max-w-[500px] overflow-scroll rounded-lg border-servcy-wheat p-1"
                  dangerouslySetInnerHTML={{
                    __html: remark()
                      .use(html)
                      .processSync(data.pull_request.body)
                      .toString(),
                  }}
                />
              </div>
            )}
          </>
        );
      }
      default:
        return <div>Event not supported</div>;
    }
  };

  return (
    <div className="col-span-2 max-h-[600px] overflow-y-scroll rounded-l-lg bg-servcy-black p-4 text-servcy-white">
      <div className="mb-4 min-h-[75px] text-servcy-white">
        {renderGithubEvent()}
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
            <Image
              src={cleanImageLink}
              alt={login}
              className="mr-2 inline h-5 w-5 rounded-full"
              loader={() => cleanImageLink}
              width={20}
              height={20}
            />
            {login}
          </div>
          <div className="flex-row">
            {new Date(parseFloat(timestamp) * 1000).toLocaleString("en-US", {
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

export default GithubNotification;

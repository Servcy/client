import Image from "next/image"

import { Tag, Tooltip } from "antd"
import { BiRightArrowAlt } from "react-icons/bi"
import { HiExternalLink } from "react-icons/hi"
import { remark } from "remark"
import html from "remark-html"

import { getCleanLink } from "@helpers/common.helper"

import type { GithubNotificationProps } from "@servcy/types"

const GithubNotification = ({ data, cause, timestamp }: GithubNotificationProps) => {
    let link = "#null"
    let linkLabel = ""
    const { login, avatar_url } = JSON.parse(cause)
    const cleanImageLink = getCleanLink(avatar_url)

    const renderGithubEvent = () => {
        switch (data.event) {
            case "pull_request_review_thread": {
                link = data.thread?.comments[0]?.html_url ?? "#null"
                linkLabel = "View thread in Github"
                return (
                    <>
                        <div className="mb-2 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">
                                Pull Request:
                            </div>
                            <div>
                                {data.pull_request?.title} [#{data.pull_request?.number}]{" "}
                                <a href={data.pull_request?.html_url} target="_blank" rel="noreferrer">
                                    <HiExternalLink
                                        className="my-auto inline text-custom-servcy-silver hover:text-custom-servcy-wheat"
                                        size="18"
                                    />
                                </a>
                            </div>
                        </div>
                        <div className="mb-2 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">State:</div>
                            <div>
                                <Tag className="m-1 bg-custom-servcy-wheat font-bold text-custom-servcy-white">
                                    {data.pull_request?.state}
                                </Tag>
                            </div>
                        </div>
                        <div className="mb-2 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">
                                Action Taken:
                            </div>
                            <div>
                                <Tag className="m-1 bg-custom-servcy font-bold text-custom-servcy-white">
                                    {data.action.charAt(0).toUpperCase() + data.action.slice(1)}
                                </Tag>
                            </div>
                        </div>
                        {data.pull_request?.labels && (
                            <div className="mb-2 flex w-full">
                                <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">Labels:</div>
                                <div>
                                    {data.pull_request.labels.map((label) => (
                                        <Tag key={label.id} className="m-1" color={`#${label.color}`}>
                                            {label.name.charAt(0).toUpperCase() + label.name.slice(1)}
                                        </Tag>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="mb-2 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">Thread:</div>
                            <div
                                className="border-1 servcy-link-inbox-item-comment max-w-[500px] overflow-scroll rounded-lg border-custom-servcy-wheat p-1"
                                dangerouslySetInnerHTML={{
                                    __html: remark().use(html).processSync(data.thread?.comments[0]?.body).toString(),
                                }}
                            />
                        </div>
                    </>
                )
            }
            case "pull_request_review_comment": {
                link = data.comment?.html_url ?? "#null"
                linkLabel = "View comment in Github"
                return (
                    <>
                        <div className="mb-2 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">
                                Pull Request:
                            </div>
                            <div>
                                {data.pull_request?.title} [#{data.pull_request?.number}]{" "}
                                <a href={data.pull_request?.html_url} target="_blank" rel="noreferrer">
                                    <HiExternalLink
                                        className="my-auto inline text-custom-servcy-silver hover:text-custom-servcy-wheat"
                                        size="18"
                                    />
                                </a>
                            </div>
                        </div>
                        <div className="mb-2 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">State:</div>
                            <div>
                                <Tag className="m-1 bg-custom-servcy-wheat font-bold text-custom-servcy-white">
                                    {data.pull_request?.state}
                                </Tag>
                            </div>
                        </div>
                        <div className="mb-2 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">
                                Action Taken:
                            </div>
                            <div>
                                <Tag className="m-1 bg-custom-servcy font-bold text-custom-servcy-white">
                                    {data.action.charAt(0).toUpperCase() + data.action.slice(1)}
                                </Tag>
                            </div>
                        </div>
                        {data.pull_request?.labels && (
                            <div className="mb-2 flex w-full">
                                <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">Labels:</div>
                                <div>
                                    {data.pull_request.labels.map((label) => (
                                        <Tag key={label.id} className="m-1" color={`#${label.color}`}>
                                            {label.name.charAt(0).toUpperCase() + label.name.slice(1)}
                                        </Tag>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="mb-2 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">Comment:</div>
                            <div
                                className="border-1 servcy-link-inbox-item-comment max-w-[500px] overflow-scroll rounded-lg border-custom-servcy-wheat p-1"
                                dangerouslySetInnerHTML={{
                                    __html: remark().use(html).processSync(data.comment?.body).toString(),
                                }}
                            />
                        </div>
                        <div className="mb-2 mt-4 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">Reactions:</div>
                            <div className="text-xs font-semibold text-custom-servcy-black">
                                <span className="border-1 mr-2 rounded-lg bg-custom-servcy-white p-1">
                                    👍 {data.comment?.reactions["+1"]}
                                </span>
                                <span className="border-1 mr-2 rounded-lg bg-custom-servcy-white p-1">
                                    👎 {data.comment?.reactions["-1"]}
                                </span>
                                <span className="border-1 mr-2 rounded-lg bg-custom-servcy-white p-1">
                                    😄 {data.comment?.reactions.laugh}
                                </span>
                                <span className="border-1 mr-2 rounded-lg bg-custom-servcy-white p-1">
                                    🎉 {data.comment?.reactions.hooray}
                                </span>
                                <span className="border-1 mr-2 rounded-lg bg-custom-servcy-white p-1">
                                    😕 {data.comment?.reactions.confused}
                                </span>
                                <span className="border-1 mr-2 rounded-lg bg-custom-servcy-white p-1">
                                    ❤️ {data.comment?.reactions.heart}
                                </span>
                                <span className="border-1 mr-2 rounded-lg bg-custom-servcy-white p-1">
                                    🚀 {data.comment?.reactions.rocket}
                                </span>
                                <span className="border-1 rounded-lg bg-custom-servcy-white p-1">
                                    👀 {data.comment?.reactions.eyes}
                                </span>
                            </div>
                        </div>
                    </>
                )
            }
            case "pull_request_review": {
                link = data.review?.html_url ?? "#null"
                linkLabel = "View review in Github"
                return (
                    <>
                        <div className="mb-2 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">
                                Pull Request:
                            </div>
                            <div>
                                {data.pull_request?.title} [#{data.pull_request?.number}]{" "}
                                <a href={data.pull_request?.html_url} target="_blank" rel="noreferrer">
                                    <HiExternalLink
                                        className="my-auto inline text-custom-servcy-silver hover:text-custom-servcy-wheat"
                                        size="18"
                                    />
                                </a>
                            </div>
                        </div>
                        <div className="mb-2 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">State:</div>
                            <div>
                                <Tag className="m-1 bg-custom-servcy-wheat font-bold text-custom-servcy-white">
                                    {data.pull_request?.state}
                                </Tag>
                            </div>
                        </div>
                        <div className="mb-2 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">
                                Action Taken:
                            </div>
                            <div>
                                <Tag className="m-1 bg-custom-servcy font-bold text-custom-servcy-white">
                                    {data.action.charAt(0).toUpperCase() + data.action.slice(1)}
                                </Tag>
                            </div>
                        </div>
                        {data.pull_request?.labels && (
                            <div className="mb-2 flex w-full">
                                <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">Labels:</div>
                                <div>
                                    {data.pull_request.labels.map((label) => (
                                        <Tag key={label.id} className="m-1" color={`#${label.color}`}>
                                            {label.name.charAt(0).toUpperCase() + label.name.slice(1)}
                                        </Tag>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="mb-2 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">
                                Review State:
                            </div>
                            <div>
                                <Tag className="m-1 bg-custom-servcy font-bold text-custom-servcy-white">
                                    {data.review?.state}
                                </Tag>
                            </div>
                        </div>
                        {data.review?.body && (
                            <div className="mb-2 flex w-full">
                                <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">
                                    Review comment:
                                </div>
                                <div
                                    className="border-1 servcy-link-inbox-item-comment max-w-[500px] overflow-scroll rounded-lg border-custom-servcy-wheat p-1"
                                    dangerouslySetInnerHTML={{
                                        __html: remark().use(html).processSync(data.review.body).toString(),
                                    }}
                                />
                            </div>
                        )}
                    </>
                )
            }
            case "issues": {
                link = data.issue?.html_url ?? "#null"
                linkLabel = "View issue in Github"
                return (
                    <>
                        <div className="mb-2 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">Issue:</div>
                            <div>
                                {data.issue?.title} [#
                                {data.issue?.number}]
                            </div>
                        </div>
                        <div className="mb-2 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">
                                Action Taken:
                            </div>
                            <div>
                                <Tag className="m-1 bg-custom-servcy font-bold text-custom-servcy-white">
                                    {data.action.charAt(0).toUpperCase() + data.action.slice(1)}
                                </Tag>
                            </div>
                        </div>
                        {data.issue?.state && (
                            <div className="mb-2 flex w-full">
                                <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">State:</div>
                                <div>
                                    <Tag className="m-1 bg-custom-servcy font-bold text-custom-servcy-white">
                                        {data.issue.state.charAt(0).toUpperCase() + data.issue.state.slice(1)}
                                    </Tag>
                                </div>
                            </div>
                        )}
                        {data.issue?.closed_at && (
                            <div className="mb-2 flex w-full">
                                <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">
                                    Closed On:
                                </div>
                                <div>
                                    {new Date(parseFloat(data.issue.closed_at) * 1000).toLocaleString("en-US", {
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
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">Comments:</div>
                            <div>{data.issue?.comments}</div>
                        </div>
                        {data.issue?.body && (
                            <div className="mb-2 flex w-full">
                                <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">
                                    Description:
                                </div>
                                <div
                                    className="border-1 servcy-link-inbox-item-comment max-w-[500px] overflow-scroll rounded-lg border-custom-servcy-wheat p-1"
                                    dangerouslySetInnerHTML={{
                                        __html: remark().use(html).processSync(data.issue.body).toString(),
                                    }}
                                />
                            </div>
                        )}
                        {data.issue?.assignees && (
                            <div className="mb-2 flex w-full">
                                <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">
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
                                <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">Labels:</div>
                                <div>
                                    {data.issue.labels.map((label) => (
                                        <Tag key={label.id} className="m-1" color={`#${label.color}`}>
                                            {label.name.charAt(0).toUpperCase() + label.name.slice(1)}
                                        </Tag>
                                    ))}
                                </div>
                            </div>
                        )}
                        {data.issue?.milestone && (
                            <div className="mb-2 flex w-full">
                                <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">
                                    Milestone:
                                </div>
                                <div>
                                    <a
                                        href={data.issue.milestone.html_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-custom-servcy-wheat hover:text-custom-servcy-silver hover:underline"
                                    >
                                        <HiExternalLink className="mr-1 inline" size="18" />
                                        {data.issue.milestone.title}
                                    </a>
                                </div>
                            </div>
                        )}
                        <div className="mb-2 mt-4 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">Reactions:</div>
                            <div className="text-xs font-semibold text-custom-servcy-black">
                                <span className="border-1 mr-2 rounded-lg bg-custom-servcy-white p-1">
                                    👍 {data.issue?.reactions["+1"]}
                                </span>
                                <span className="border-1 mr-2 rounded-lg bg-custom-servcy-white p-1">
                                    👎 {data.issue?.reactions["-1"]}
                                </span>
                                <span className="border-1 mr-2 rounded-lg bg-custom-servcy-white p-1">
                                    😄 {data.issue?.reactions.laugh}
                                </span>
                                <span className="border-1 mr-2 rounded-lg bg-custom-servcy-white p-1">
                                    🎉 {data.issue?.reactions.hooray}
                                </span>
                                <span className="border-1 mr-2 rounded-lg bg-custom-servcy-white p-1">
                                    😕 {data.issue?.reactions.confused}
                                </span>
                                <span className="border-1 mr-2 rounded-lg bg-custom-servcy-white p-1">
                                    ❤️ {data.issue?.reactions.heart}
                                </span>
                                <span className="border-1 mr-2 rounded-lg bg-custom-servcy-white p-1">
                                    🚀 {data.issue?.reactions.rocket}
                                </span>
                                <span className="border-1 rounded-lg bg-custom-servcy-white p-1">
                                    👀 {data.issue?.reactions.eyes}
                                </span>
                            </div>
                        </div>
                    </>
                )
            }
            case "issue_comment": {
                link = data.comment?.html_url ?? "#null"
                linkLabel = "View comment in Github"
                return (
                    <>
                        <div className="mb-2 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">Comment:</div>
                            <div
                                className="border-1 servcy-link-inbox-item-comment max-w-[500px] overflow-scroll rounded-lg border-custom-servcy-wheat p-1"
                                dangerouslySetInnerHTML={{
                                    __html: remark().use(html).processSync(data.comment?.body).toString(),
                                }}
                            />
                        </div>
                        <div className="mb-2 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">
                                Action Taken:
                            </div>
                            <div>
                                <Tag className="m-1 bg-custom-servcy font-bold text-custom-servcy-white">
                                    {data.action.charAt(0).toUpperCase() + data.action.slice(1)}
                                </Tag>
                            </div>
                        </div>
                        <div className="mb-2 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">Issue:</div>
                            <div>
                                {data.issue?.title} [#
                                {data.issue?.number}]
                            </div>
                        </div>
                        <div className="mb-2 mt-4 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">Reactions:</div>
                            <div className="text-xs font-semibold text-custom-servcy-black">
                                <span className="border-1 mr-2 rounded-lg bg-custom-servcy-white p-1">
                                    👍 {data.comment?.reactions["+1"]}
                                </span>
                                <span className="border-1 mr-2 rounded-lg bg-custom-servcy-white p-1">
                                    👎 {data.comment?.reactions["-1"]}
                                </span>
                                <span className="border-1 mr-2 rounded-lg bg-custom-servcy-white p-1">
                                    😄 {data.comment?.reactions.laugh}
                                </span>
                                <span className="border-1 mr-2 rounded-lg bg-custom-servcy-white p-1">
                                    🎉 {data.comment?.reactions.hooray}
                                </span>
                                <span className="border-1 mr-2 rounded-lg bg-custom-servcy-white p-1">
                                    😕 {data.comment?.reactions.confused}
                                </span>
                                <span className="border-1 mr-2 rounded-lg bg-custom-servcy-white p-1">
                                    ❤️ {data.comment?.reactions.heart}
                                </span>
                                <span className="border-1 mr-2 rounded-lg bg-custom-servcy-white p-1">
                                    🚀 {data.comment?.reactions.rocket}
                                </span>
                                <span className="border-1 rounded-lg bg-custom-servcy-white p-1">
                                    👀 {data.comment?.reactions.eyes}
                                </span>
                            </div>
                        </div>
                    </>
                )
            }
            case "pull_request": {
                link = data.pull_request?.html_url ?? "#null"
                linkLabel = "View PR in Github"
                return (
                    <>
                        <div className="mb-2 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">
                                Pull Request:
                            </div>
                            <div>
                                {data.pull_request?.title} [#{data.pull_request?.number}] [
                                <a
                                    href={data.pull_request?.diff_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-custom-servcy hover:text-custom-servcy-wheat"
                                >
                                    Diff
                                    <HiExternalLink className="my-auto inline" size="18" />
                                </a>
                                ]&nbsp;[
                                <a
                                    href={data.pull_request?.patch_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-red-400 hover:text-custom-servcy-wheat"
                                >
                                    Patch
                                    <HiExternalLink className="my-auto inline" size="18" />
                                </a>
                                ]
                            </div>
                        </div>
                        <div className="mb-2 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">Branch:</div>
                            <div className="font-semibold">
                                {data.pull_request?.base.ref} <BiRightArrowAlt className="inline" />{" "}
                                {data.pull_request?.head.ref}
                            </div>
                        </div>
                        {data.pull_request?.state && (
                            <div className="mb-2 flex w-full">
                                <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">State:</div>
                                <div>
                                    <Tag className="m-1 bg-custom-servcy-wheat font-bold text-custom-servcy-white">
                                        {data.pull_request.state.charAt(0).toUpperCase() +
                                            data.pull_request.state.slice(1)}
                                    </Tag>
                                </div>
                            </div>
                        )}
                        {data.pull_request?.draft && (
                            <div className="mb-2 flex w-full">
                                <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">
                                    Is Draft:
                                </div>
                                <div>✅</div>
                            </div>
                        )}
                        {data.pull_request?.milestone && (
                            <div className="mb-2 flex w-full">
                                <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">
                                    Milestone:
                                </div>
                                <div>
                                    <a
                                        href={data.pull_request.milestone.html_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-custom-servcy-wheat hover:text-custom-servcy-silver hover:underline"
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
                                <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">
                                    Issue Url:
                                </div>
                                <div>
                                    <a
                                        href={data.pull_request.issue_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-custom-servcy-wheat hover:text-custom-servcy-silver hover:underline"
                                    >
                                        <HiExternalLink className="mr-1 inline" size="18" />
                                        {data.pull_request.issue_url.slice(data.pull_request.issue_url.length - 6)}
                                        ...
                                    </a>
                                </div>
                            </div>
                        )}
                        {data.pull_request?.assignees && (
                            <div className="mb-2 flex w-full">
                                <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">
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
                                <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">
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
                                <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">
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
                                            loader={() => data.pull_request?.merged_by.avatar_url ?? "#null"}
                                        />
                                    </Tooltip>
                                </div>
                            </div>
                        )}
                        <div className="mb-2 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">
                                Action Taken:
                            </div>
                            <div>
                                <Tag className="m-1 bg-custom-servcy font-bold text-custom-servcy-white">
                                    {data.action.charAt(0).toUpperCase() + data.action.slice(1)}
                                </Tag>
                            </div>
                        </div>
                        {data.pull_request?.labels && data.pull_request.labels.length > 0 && (
                            <div className="mb-2 flex w-full">
                                <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">Labels:</div>
                                <div>
                                    {data.pull_request.labels.map((label) => (
                                        <Tag key={label.id} className="m-1" color={`#${label.color}`}>
                                            {label.name.charAt(0).toUpperCase() + label.name.slice(1)}
                                        </Tag>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="mb-2 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">Comments:</div>
                            <div>{data.pull_request?.comments}</div>
                        </div>
                        <div className="mb-2 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">Commits:</div>
                            <div>{data.pull_request?.commits}</div>
                        </div>
                        <div className="mb-2 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">Additions:</div>
                            <div className="text-custom-servcy">+ {data.pull_request?.additions}</div>
                        </div>
                        <div className="mb-2 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">Deletions:</div>
                            <div className="text-red-400">- {data.pull_request?.deletions}</div>
                        </div>
                        <div className="mb-2 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">
                                Files Changed:
                            </div>
                            <div>{data.pull_request?.changed_files}</div>
                        </div>
                        {data.pull_request?.body && (
                            <div className="mb-2 flex w-full">
                                <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">Body:</div>
                                <div
                                    className="border-1 servcy-link-inbox-item-comment max-w-[500px] overflow-scroll rounded-lg border-custom-servcy-wheat p-1"
                                    dangerouslySetInnerHTML={{
                                        __html: remark().use(html).processSync(data.pull_request.body).toString(),
                                    }}
                                />
                            </div>
                        )}
                    </>
                )
            }
            default:
                return <div>Event not supported</div>
        }
    }

    return (
        <div className="col-span-2 max-h-[600px] overflow-y-scroll rounded-l-lg bg-custom-servcy-black p-4 text-custom-servcy-white">
            <div className="mb-4 min-h-[75px] text-custom-servcy-white">{renderGithubEvent()}</div>
            <div className="flex justify-between">
                {linkLabel && (
                    <a
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-custom-servcy-wheat hover:text-custom-servcy-silver hover:underline"
                    >
                        <HiExternalLink className="mr-1 inline" size="18" />
                        {linkLabel}
                    </a>
                )}

                <div className="flex flex-col text-xs text-custom-servcy-wheat">
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
    )
}

export default GithubNotification

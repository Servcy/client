import Image from "next/image.js"

import { HiExternalLink } from "react-icons/hi"
import { remark } from "remark"
import html from "remark-html"

import type { JiraNotificationProps } from "@servcy/types"

const TrelloNotification = ({ data, cause }: JiraNotificationProps) => {
    const projectUrl = data.issue.self.split("/rest/api")[0]
    const issueKey = data.issue.key
    let link = `${projectUrl}/browse/${issueKey}`
    let linkLabel = "View issue on Jira"
    const { displayName } = cause

    const renderTrelloEvent = () => {
        if (data.webhookEvent.startsWith("jira:")) {
            return (
                <>
                    <div className="mb-2 flex w-full">
                        <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">
                            Issue Title:
                        </div>
                        <div>{data.issue.fields.summary}</div>
                    </div>
                    {data.issue.fields.description && (
                        <div className="mb-2 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">
                                Description:
                            </div>
                            <div
                                className="border-1 servcy-link-inbox-item-comment max-w-[500px] overflow-scroll rounded-lg border-custom-servcy-wheat p-1"
                                dangerouslySetInnerHTML={{
                                    __html: remark().use(html).processSync(data.issue.fields.description).toString(),
                                }}
                            />
                        </div>
                    )}
                    {data.issue.fields.issuetype && (
                        <div className="mb-2 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">
                                Issue Type:
                            </div>
                            <div>{data.issue.fields.issuetype.name}</div>
                        </div>
                    )}
                    {data.issue.fields.status && (
                        <div className="mb-2 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">
                                Status:
                            </div>
                            <div>{data.issue.fields.status.name}</div>
                        </div>
                    )}
                    {data.changelog && (
                        <div className="mb-2 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">
                                Updated Fields:
                            </div>
                            <div>
                                {data.changelog.items.map((item) => (
                                    <div key={item.field}>
                                        {item.field} changed from {item.fromString} to {item.toString}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {data.issue.fields.priority && (
                        <div className="mb-2 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">
                                Priority:
                            </div>
                            <div>{data.issue.fields.priority.name}</div>
                        </div>
                    )}
                    {data.issue.fields.project && (
                        <div className="mb-2 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">
                                project:
                            </div>
                            <div className="flex justify-center">
                                <Image
                                    src={data.issue.fields.project.avatarUrls["48x48"]}
                                    alt={data.issue.fields.project.name}
                                    width={24}
                                    height={24}
                                    loader={({ src }) => src}
                                    className="mr-2 rounded-full"
                                />
                                {data.issue.fields.project.name}
                                <a
                                    href={`${projectUrl}/browse/${data.issue.fields.project.key}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <HiExternalLink
                                        className="my-auto inline text-custom-servcy-silver hover:text-custom-servcy-wheat"
                                        size="18"
                                    />
                                </a>
                            </div>
                        </div>
                    )}
                    {data.issue.fields.assignee && (
                        <div className="mb-2 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">
                                Assignee:
                            </div>
                            <div>
                                <div className="flex justify-center">
                                    <Image
                                        src={data.issue.fields.assignee.avatarUrls["48x48"]}
                                        alt={data.issue.fields.assignee.displayName}
                                        width={24}
                                        height={24}
                                        loader={({ src }) => src}
                                        className="mr-2 rounded-full"
                                    />
                                    <span>{data.issue.fields.assignee.displayName}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )
        }
        if (data.webhookEvent.startsWith("comment") && data.comment) {
            linkLabel = "View comment on Jiira"
            link = `${projectUrl}/browse/${issueKey}?focusedCommentId=${data.comment.id}`
            return (
                <>
                    <div className="mb-2 flex w-full">
                        <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">Comment:</div>
                        <div
                            className="border-1 servcy-link-inbox-item-comment max-w-[500px] overflow-scroll rounded-lg border-custom-servcy-wheat p-1"
                            dangerouslySetInnerHTML={{
                                __html: remark().use(html).processSync(data.comment.body).toString(),
                            }}
                        />
                    </div>
                    <div className="mb-2 flex w-full">
                        <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">
                            Issue Title:
                        </div>
                        <div>{data.issue.fields.summary}</div>
                    </div>
                    {data.issue.fields.description && (
                        <div className="mb-2 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">
                                Description:
                            </div>
                            <div
                                className="border-1 servcy-link-inbox-item-comment max-w-[500px] overflow-scroll rounded-lg border-custom-servcy-wheat p-1"
                                dangerouslySetInnerHTML={{
                                    __html: remark().use(html).processSync(data.issue.fields.description).toString(),
                                }}
                            />
                        </div>
                    )}
                    {data.issue.fields.status && (
                        <div className="mb-2 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">
                                Status:
                            </div>
                            <div>{data.issue.fields.status.name}</div>
                        </div>
                    )}
                    {data.changelog && (
                        <div className="mb-2 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">
                                Updated Fields:
                            </div>
                            <div>
                                {data.changelog.items.map((item) => (
                                    <div key={item.field}>
                                        {item.field} changed from {item.fromString} to {item.toString}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {data.issue.fields.priority && (
                        <div className="mb-2 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">
                                Priority:
                            </div>
                            <div>{data.issue.fields.priority.name}</div>
                        </div>
                    )}
                    {data.comment.author && (
                        <div className="mb-2 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">
                                Comment Author:
                            </div>
                            <div>
                                <div className="flex justify-center">
                                    <Image
                                        src={data.comment.author.avatarUrls["48x48"]}
                                        alt={data.comment.author.displayName}
                                        width={24}
                                        height={24}
                                        loader={({ src }) => src}
                                        className="mr-2 rounded-full"
                                    />
                                    <span>{data.comment.author.displayName}</span>
                                </div>
                            </div>
                        </div>
                    )}
                    {data.issue.fields.project && (
                        <div className="mb-2 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">
                                project:
                            </div>
                            <div className="flex justify-center">
                                <Image
                                    src={data.issue.fields.project.avatarUrls["48x48"]}
                                    alt={data.issue.fields.project.name}
                                    width={24}
                                    height={24}
                                    loader={({ src }) => src}
                                    className="mr-2 rounded-full"
                                />
                                {data.issue.fields.project.name}
                                <a
                                    href={`${projectUrl}/browse/${data.issue.fields.project.key}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <HiExternalLink
                                        className="my-auto inline text-custom-servcy-silver hover:text-custom-servcy-wheat"
                                        size="18"
                                    />
                                </a>
                            </div>
                        </div>
                    )}
                    {data.issue.fields.assignee && (
                        <div className="mb-2 flex w-full">
                            <div className="mr-2 w-[150px] font-mono font-semibold text-custom-servcy-silver">
                                Assignee:
                            </div>
                            <div>
                                <div className="flex justify-center">
                                    <Image
                                        src={data.issue.fields.assignee.avatarUrls["48x48"]}
                                        alt={data.issue.fields.assignee.displayName}
                                        width={24}
                                        height={24}
                                        loader={({ src }) => src}
                                        className="mr-2 rounded-full"
                                    />
                                    <span>{data.issue.fields.assignee.displayName}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )
        } else return <div>Event not supported</div>
    }

    return (
        <div className="col-span-2 max-h-[600px] overflow-y-scroll rounded-l-lg bg-custom-servcy-black p-4 text-custom-servcy-white">
            <div className="mb-4 min-h-[75px] text-custom-servcy-white">{renderTrelloEvent()}</div>
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
                    <div className="mb-2 flex-row">{displayName}</div>
                    <div className="flex-row">
                        {new Date(data.timestamp).toLocaleString("en-US", {
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

export default TrelloNotification

import Image from "next/image"

import { HiExternalLink } from "react-icons/hi"

import { getCleanLink } from "@helpers/common.helper"

import type { NotionComment } from "@/types/integrations/notion"

const NotionComment = ({ data, cause }: { data: NotionComment; cause: any }) => {
    const discussionLink = `https://www.notion.so/${data.parent.page_id.split("-").join("")}?d=${data.discussion_id
        .split("-")
        .join("")}`
    const { name, avatar_url } = JSON.parse(cause)
    const cleanImageLink = getCleanLink(avatar_url)
    return (
        <div className="col-span-2 max-h-[600px] overflow-y-scroll rounded-l-lg bg-servcy-black p-4 text-servcy-white">
            <div className="min-h-[75px]">
                {data.rich_text.map((content, index) => {
                    if (content.type === "text" && content.text && content.text.link) {
                        return (
                            <>
                                <a
                                    key={index}
                                    href={content.text.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline hover:underline"
                                >
                                    {content.text.content}
                                </a>
                                {index !== data.rich_text.length - 1 ? " " : ""}
                            </>
                        )
                    } else if (content.type === "text" && content.text) {
                        return (
                            <>
                                {content.text.content}
                                {index !== data.rich_text.length - 1 ? " " : ""}
                            </>
                        )
                    } else if (content.type === "mention" && content.mention) {
                        return (
                            <>
                                <Image
                                    src={content.mention.user.avatar_url}
                                    width={50}
                                    alt={content.mention.user.name}
                                    height={50}
                                    className="mr-2 inline h-5 w-5 rounded-full"
                                    loader={({ src }) => src}
                                />
                                {content.plain_text}
                                {index !== data.rich_text.length - 1 ? " " : ""}
                            </>
                        )
                    }
                    return (
                        <>
                            {content.plain_text}
                            {index !== data.rich_text.length - 1 ? " " : ""}
                        </>
                    )
                })}
            </div>
            <div className="flex justify-between">
                <a
                    href={discussionLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-servcy-wheat hover:text-servcy-silver hover:underline"
                >
                    <HiExternalLink className="mr-1 inline" size="18" />
                    View in Notion
                </a>
                <div className="flex flex-col text-xs text-servcy-wheat">
                    <div className="mb-2 flex-row">
                        <Image
                            src={cleanImageLink}
                            alt={name}
                            className="mr-2 inline h-5 w-5 rounded-full"
                            loader={() => cleanImageLink}
                            width={20}
                            height={20}
                        />
                        {name}
                    </div>
                    <div className="flex-row">
                        {new Date(data.created_time).toLocaleString("en-US", {
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

export default NotionComment

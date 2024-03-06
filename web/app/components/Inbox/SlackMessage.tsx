import Image from "next/image"
import cn from "classnames"
import { HiExternalLink, HiPaperClip } from "react-icons/hi"
import { SlackMessageElementProps, SlackMessageProps } from "@/types/integrations/slack"
import { getCleanLink } from "@/utils/Shared"

const SlackMessage = ({ data, cause }: { data: SlackMessageProps; cause: string }) => {
    const link = `https://servcy.slack.com/archives/${data.channel}/p${data.ts.replace(".", "")}`
    const { real_name, image_32 } = JSON.parse(cause)
    const cleanImageLink = getCleanLink(image_32)

    const renderElements = (elements?: SlackMessageElementProps[]) => {
        if (!elements) return null
        return elements.map((element: SlackMessageElementProps, index: number) => {
            switch (element.type) {
                case "text":
                    return element.text === "\n" ? (
                        <br />
                    ) : element.text === " " ? (
                        <span>&nbsp;</span>
                    ) : typeof element.style === "object" && element.style.code ? (
                        <code
                            key={index}
                            className="border-1 border-servcy-wheat bg-servcy-cream p-0.5 text-servcy-black"
                        >
                            {element.text}
                        </code>
                    ) : (
                        <span
                            key={index}
                            className={cn({
                                "font-semibold": element.style?.bold,
                                italic: typeof element.style === "object" && element.style.italic,
                                "line-through": element.style?.strike,
                            })}
                        >
                            {element.text}
                        </span>
                    )
                case "link":
                    return (
                        <a key={index} href={element.url} className="text-servcy-wheat hover:text-servcy-silver">
                            {element.text}
                        </a>
                    )
                case "user": {
                    if (data["x-servcy-mentions"] && data["x-servcy-mentions"].length > 0) {
                        const mentioned_profile = data["x-servcy-mentions"].find(
                            (mention) => mention.id === element.user_id
                        )
                        if (mentioned_profile)
                            return (
                                <>
                                    <Image
                                        src={mentioned_profile.profile.image_32}
                                        width={50}
                                        alt={mentioned_profile.name}
                                        height={50}
                                        className="mx-2 inline h-5 w-5 rounded-full"
                                        loader={({ src }) => src}
                                    />
                                    @{mentioned_profile.name}
                                </>
                            )
                    }
                    return <span key={index}>@{element.user_id}</span>
                }
                case "rich_text_section":
                    return (
                        <span
                            style={{
                                marginLeft: element.indent ? `${element.indent * 10}px` : "0px",
                            }}
                        >
                            {renderElements(element.elements)}
                        </span>
                    )
                case "rich_text_preformatted":
                    return (
                        <pre
                            key={index}
                            className="border-1 my-2 rounded-lg border-servcy-wheat bg-servcy-cream p-1 font-mono text-servcy-black"
                        >
                            {renderElements(element.elements)}
                        </pre>
                    )
                case "rich_text_quote":
                    return (
                        <blockquote
                            key={index}
                            className="mb-2 border-l-4 pl-2"
                            style={{
                                marginLeft: element.indent ? `${element.indent * 10}px` : "0px",
                            }}
                        >
                            {renderElements(element.elements)}
                        </blockquote>
                    )
                case "rich_text_list":
                    return element.style === "ordered" ? (
                        <ol
                            key={index}
                            className="mb-2 ml-2"
                            style={{
                                marginLeft: element.indent ? `${element.indent * 10}px` : "0px",
                                listStyle: "inside decimal",
                            }}
                        >
                            {element.elements?.map((listItem: SlackMessageElementProps, listItemIndex: number) => (
                                <li key={listItemIndex}>{renderElements(listItem.elements)}</li>
                            ))}
                        </ol>
                    ) : (
                        <ul
                            key={index}
                            className="mb-2 ml-2"
                            style={{
                                marginLeft: element.indent ? `${element.indent * 20}px` : "0px",
                                listStyle: "inside circle",
                            }}
                        >
                            {element.elements?.map((listItem: SlackMessageElementProps, listItemIndex: number) => (
                                <li key={listItemIndex}>{renderElements(listItem.elements)}</li>
                            ))}
                        </ul>
                    )
                default:
                    return null
            }
        })
    }

    const renderMessageBlocks = (blocks: SlackMessageProps["blocks"]) => {
        if (!blocks) return null
        return blocks.map((block, index) => {
            switch (block.type) {
                case "rich_text":
                    return <div key={index}>{renderElements(block.elements)}</div>
                default:
                    return null
            }
        })
    }

    return (
        <div className="col-span-2 max-h-[600px] overflow-y-scroll rounded-l-lg bg-servcy-black p-4 text-servcy-white">
            {data.blocks && <div className="mb-4 min-h-[75px]">{renderMessageBlocks(data.blocks)}</div>}
            {data.files ? (
                <div className="mb-4 grid grid-cols-6 gap-4">
                    {data.files.map((file) => (
                        <div key={file.id} className="rounded-xl bg-servcy-silver p-3">
                            <a
                                href={file.url_private}
                                target="_blank"
                                rel="noreferrer"
                                className="text-servcy-white hover:text-servcy-wheat hover:underline"
                            >
                                <HiPaperClip className="mr-1 inline" size="18" />
                                {file.title || file.name}
                            </a>
                        </div>
                    ))}
                </div>
            ) : null}
            <div className="flex justify-between">
                <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-servcy-wheat hover:text-servcy-silver hover:underline"
                >
                    <HiExternalLink className="mr-1 inline" size="18" />
                    View in Slack
                </a>
                <div className="flex flex-col text-xs text-servcy-wheat">
                    <div className="mb-2 flex-row">
                        <Image
                            src={cleanImageLink}
                            alt={real_name}
                            className="mr-2 inline h-5 w-5 rounded-full"
                            loader={() => cleanImageLink}
                            width={20}
                            height={20}
                        />
                        {real_name}
                    </div>
                    <div className="flex-row">
                        {new Date(parseFloat(data.event_ts) * 1000).toLocaleString("en-US", {
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

export default SlackMessage

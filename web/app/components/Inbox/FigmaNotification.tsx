import { HiExternalLink } from "react-icons/hi"
import type { Comment, FigmaNotificationProps, Mention } from "@/types/integrations/figma"

const FigmaNotification = ({ data, cause }: { data: FigmaNotificationProps; cause: string }) => {
    const link = `https://www.figma.com/file/${data.file_key}`
    return (
        <div className="col-span-2 max-h-[600px] overflow-y-scroll rounded-l-lg bg-servcy-black p-4 text-servcy-white">
            {["FILE_UPDATE", "FILE_DELETE"].includes(data.event_type) ? null : data.event_type === "LIBRARY_PUBLISH" ? (
                <div className="min-h-[75px]">
                    {data.description && <div className="mb-2 font-normal"> {data.description}</div>}
                    {data.created_components && (
                        <div className="mb-4">
                            <div className="text-xs font-semibold text-servcy-wheat">
                                Following Components Were Created:
                            </div>
                            <ul className="text-sm">
                                {data.created_components.map((component) => (
                                    <li key={component.key}>{component.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {data.modified_components && (
                        <div className="mb-4">
                            <div className="text-xs font-semibold text-servcy-wheat">
                                Following Components Were Modified:
                            </div>
                            <ul className="text-sm">
                                {data.modified_components.map((component) => (
                                    <li key={component.key}>{component.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {data.created_styles && (
                        <div className="mb-4">
                            <div className="text-xs font-semibold text-servcy-wheat">
                                Following Styles Were Created:
                            </div>
                            <ul className="text-sm">
                                {data.created_styles.map((component) => (
                                    <li key={component.key}>{component.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {data.deleted_components && (
                        <div className="mb-4">
                            <div className="text-xs font-semibold text-servcy-wheat">
                                Following Components Were Deleted:
                            </div>
                            <ul className="text-sm">
                                {data.deleted_components.map((component) => (
                                    <li key={component.key}>{component.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {data.deleted_styles && (
                        <div className="mb-4">
                            <div className="text-xs font-semibold text-servcy-wheat">
                                Following Styles Were Deleted:
                            </div>
                            <ul className="text-sm">
                                {data.deleted_styles.map((component) => (
                                    <li key={component.key}>{component.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {data.modified_styles && (
                        <div className="mb-4">
                            <div className="text-xs font-semibold text-servcy-wheat">
                                Following Styles Were Modified:
                            </div>
                            <ul className="text-sm">
                                {data.modified_styles.map((component) => (
                                    <li key={component.key}>{component.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ) : data.event_type === "FILE_COMMENT" && data.comment ? (
                <div className="min-h-[75px]">
                    {data.comment.map((comment: Comment, index1: number) => {
                        if (comment.text) {
                            const lines = comment.text.split("\\n")
                            return (
                                <span key={index1}>
                                    {lines.map((line, index2) => (
                                        <>
                                            <span key={index2}>{line}</span>
                                            {index2 !== lines.length - 1 ? <br /> : null}
                                            {data.comment && index1 !== data.comment.length - 1 ? " " : null}
                                        </>
                                    ))}
                                </span>
                            )
                        } else if (comment.mention && data.mentions) {
                            const handle = data.mentions.find((mention: Mention) => mention.id === comment.mention)
                            if (handle) {
                                return (
                                    <>
                                        <span key={index1} className="text-servcy-wheat">
                                            @{handle.handle}
                                        </span>
                                        {data.comment && index1 !== data.comment.length - 1 ? " " : null}
                                    </>
                                )
                            }
                        }
                        return null
                    })}
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
                    View in Figma
                </a>
                <div className="flex flex-col text-xs text-servcy-wheat">
                    <div className="mb-2 flex-row">{cause}</div>
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

export default FigmaNotification

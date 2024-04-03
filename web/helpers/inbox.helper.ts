import cn from "classnames"
import DOMPurify from "dompurify"

import {
    AsanaNotificationProps,
    FigmaComment,
    FigmaMention,
    GithubNotificationProps,
    InboxItem,
    SlackMessageProps,
    TrelloNotificationProps,
} from "@servcy/types"

export const generateDescription = (selectedRow: InboxItem) => {
    if (selectedRow.cause === "None") return "<p></p>"
    let body = selectedRow.body
    if (selectedRow.source === "Gmail") {
        body = Buffer.from(body, "base64").toString("utf8")
    }
    if (selectedRow.is_body_html) {
        body = DOMPurify.sanitize(body)
    }
    if (selectedRow.source === "Gmail" && body.includes("�")) body = selectedRow.body
    if (selectedRow.is_body_html) return body
    switch (selectedRow.source) {
        case "Notion": {
            const richText = JSON.parse(selectedRow.body).rich_text
            let description = ""
            richText.forEach((content: any, index: number) => {
                if (content.type === "text" && content.text && content.text.link) {
                    description += `<a href="${content.text.link}" target="_blank" rel="noreferrer" class="inline hover:underline">${content.text.content}</a>`
                    if (index !== richText.length - 1) description += " "
                } else if (content.type === "text" && content.text) {
                    description += `${content.text.content}`
                    if (index !== richText.length - 1) description += " "
                } else if (content.type === "mention" && content.mention) {
                    description += `<img src="${content.mention.user.avatar_url}" alt="${content.mention.user.name}" class="mr-2 inline h-5 w-5 rounded-full">${content.plain_text}`
                    if (index !== richText.length - 1) description += " "
                } else {
                    description += `${content.plain_text}`
                    if (index !== richText.length - 1) description += " "
                }
            })
            return description
        }
        case "Figma": {
            let description = ""
            const data = JSON.parse(selectedRow.body)
            if (data.event_type === "FILE_COMMENT" && data.comment) {
                data.comment.forEach((comment: FigmaComment, index1: number) => {
                    if (comment.text) {
                        const lines = comment.text.split("\\n")
                        return lines.forEach((line: any, index2: number) => {
                            description += line
                            if (index2 !== lines.length - 1) description += "<br>"
                            if (data.comment && index1 !== data.comment.length - 1) description += " "
                        })
                    } else if (comment.mention && data.mentions) {
                        const handle = data.mentions.find((mention: FigmaMention) => mention.id === comment.mention)
                        if (handle) {
                            description += `@${handle.handle}`
                            if (data.comment && index1 !== data.comment.length - 1) description += " "
                        }
                    }
                })
            } else return "<p></p>"
            return description
        }
        case "Asana": {
            const data: AsanaNotificationProps["data"] = JSON.parse(selectedRow.body)
            const taskNotes = data?.task?.notes ?? ""
            const commentText = data?.comment?.text ?? ""
            if (commentText) return commentText.toString()
            if (taskNotes) return taskNotes.toString()
            return "<p></p>"
        }
        case "Trello": {
            const data: TrelloNotificationProps["data"] = JSON.parse(selectedRow.body)
            const cardDescription = data?.data.card?.desc ?? ""
            const commentBody = data?.data.text
            if (commentBody) return commentBody.toString()
            if (cardDescription) return cardDescription.toString()
            return "<p></p>"
        }
        case "Jira": {
            const issueDescription = JSON.parse(selectedRow.body)?.issue?.fields?.description ?? ""
            const commenBody = JSON.parse(selectedRow.body)?.comment?.body ?? ""
            if (commenBody) return commenBody.toString()
            if (issueDescription) return issueDescription.toString()
            return "<p></p>"
        }
        case "Slack": {
            const data: SlackMessageProps = JSON.parse(selectedRow.body)
            const blocks = data.blocks
            let description = ""
            if (blocks) {
                blocks.forEach((block) => {
                    if (block.type !== "richText" || !block.elements) return
                    block.elements.forEach((element) => {
                        switch (element.type) {
                            case "text": {
                                if (element.text === "\n") description += "<br>"
                                else if (element.text === " ") description += "<span>&nbsp;</span>"
                                else if (typeof element.style === "object" && element.style.code) {
                                    description += `<code class="border-1 border-custom-servcy-wheat bg-custom-servcy-cream p-0.5 text-custom-servcy-black">${element.text}</code>`
                                } else {
                                    description += `<span class="${cn({
                                        "font-semibold": element.style?.bold,
                                        italic: typeof element.style === "object" && element.style.italic,
                                        "line-through": element.style?.strike,
                                    })}">${element.text}</span>`
                                }
                                break
                            }
                            case "link":
                                description += `<a href="${element.url}" target="_blank" rel="noreferrer" class="text-custom-servcy-wheat hover:text-custom-servcy-silver">${element.text}</a>`
                                break
                            case "user": {
                                if (data["x-servcy-mentions"] && data["x-servcy-mentions"].length > 0) {
                                    const mentionedProfile = data["x-servcy-mentions"].find(
                                        (mention) => mention.id === element.user_id
                                    )
                                    if (mentionedProfile)
                                        description += `<img src="${mentionedProfile.profile.image_32}" alt="${mentionedProfile.name}" class="mx-2 inline h-5 w-5 rounded-full">@${mentionedProfile.name}`
                                    break
                                }
                                description += `<span>@${element.user_id}</span>`
                                break
                            }
                            case "rich_text_section":
                                description += `<span style="margin-left: ${element.indent ? `${element.indent * 10}px` : "0px"}">${element.text}</span>`
                                break
                            case "rich_text_preformatted":
                                description += `<pre className="border-1 my-2 rounded-lg border-custom-servcy-wheat bg-custom-servcy-cream p-1 font-mono text-custom-servcy-black">${element.text}</pre>`
                                break
                            case "rich_text_quote":
                                description += `<blockquote className="border-l-4 border-custom-servcy-wheat pl-2">${element.text}</blockquote>`
                                break
                            case "rich_text_list": {
                                if (element.style === "ordered") {
                                    description += `<ol className="list-decimal list-inside">${element.text}</ol>`
                                } else {
                                    description += `<ul className="list-disc list-inside">${element.text}</ul>`
                                }
                                break
                            }
                            default:
                                break
                        }
                    })
                })
                return description
            }
            return "<p></p>"
        }
        case "Github": {
            const data: GithubNotificationProps["data"] = JSON.parse(selectedRow.body)
            const prBody = data.pull_request?.body
            const issueBody = data.issue?.body
            const commentBody = data.comment?.body
            if (data.event.endsWith("comment") && commentBody) return commentBody.toString()
            if (data.event.startsWith("pull_request") && prBody) return prBody.toString()
            if (data.event.startsWith("issue") && issueBody) return issueBody.toString()
            return "<p></p>"
        }
        default:
            return "<p></p>"
    }
}

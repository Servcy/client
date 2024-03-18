export type TIssueAttachment = {
    id: string
    meta_data: {
        name: string
        size: number
    }
    file: string
    issue_id: string

    //need
    updated_at: string
    updated_by: string
}

export type TIssueAttachmentMap = {
    [issue_id: string]: TIssueAttachment
}

export type TIssueAttachmentIdMap = {
    [issue_id: string]: string[]
}

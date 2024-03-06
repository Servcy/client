export interface Mention {
    id: string;
    handle: string;
}

export interface Comment {
    text?: string;
    mention?: string;
}

export interface FigmaNotificationProps {
    event_type: string;
    file_key: string;
    timestamp: string;
    created_components?: {
        key: string;
        name: string;
    }[];
    created_styles?: {
        key: string;
        name: string;
    }[];
    deleted_components?: {
        key: string;
        name: string;
    }[];
    deleted_styles?: {
        key: string;
        name: string;
    }[];
    description?: string;
    modified_components?: {
        key: string;
        name: string;
    }[];
    modified_styles?: {
        key: string;
        name: string;
    }[];
    comment?: Comment[];
    mentions?: Mention[];
}

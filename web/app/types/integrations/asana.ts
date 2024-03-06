export interface AsanaComment {
    gid: string
    created_at: string
    created_by: {
        gid: string
        name: string
        resource_type: string
    }
    hearted: boolean
    hearts: {
        gid: string
        user: {
            gid: string
            name: string
            resource_type: string
        }
    }[]
    is_edited: boolean
    is_pinned: boolean
    liked: boolean
    likes: {
        gid: string
        user: {
            gid: string
            name: string
            resource_type: string
        }
    }[]
    num_hearts: number
    num_likes: number
    resource_type: string
    source: string
    text: string
    type: string
    resource_subtype: string
    target: {
        gid: string
        name: string
        resource_type: string
        resource_subtype: string
    }
}

export interface AsanaTask {
    gid: string
    actual_time_minutes?: number
    assignee?: {
        gid: string
        name: string
        resource_type: string
    }
    assignee_status: string
    completed: boolean
    completed_at?: string
    created_at: string
    due_at?: string
    due_on: string
    followers?: {
        gid: string
        name: string
        resource_type: string
    }[]
    hearted: boolean
    hearts: {
        gid: string
        user: {
            gid: string
            name: string
            resource_type: string
        }
    }[]
    liked: boolean
    likes: {
        gid: string
        user: {
            gid: string
            name: string
            resource_type: string
        }
    }[]
    memberships: [
        {
            project: {
                gid: string
                name: string
                resource_type: string
            }
            section: {
                gid: string
                name: string
                resource_type: string
            }
        },
    ]
    modified_at: string
    name: string
    notes: string
    num_hearts: number
    num_likes: number
    parent?: {
        gid: string
        name: string
        resource_type: string
        resource_subtype?: string
    }
    permalink_url: string
    projects: [
        {
            gid: string
            name: string
            resource_type: string
        },
    ]
    resource_type: string
    start_at?: string
    start_on?: string
    tags: {
        gid: string
        name: string
        resource_type: string
    }[]
    resource_subtype: string
    workspace: {
        gid: string
        name: string
        resource_type: string
    }
}

export interface AsanaProject {
    gid: string
    archived: boolean
    color: string
    completed: boolean
    completed_at?: string
    created_at: string
    current_status?: {
        gid: string
        text: string
        color: string
    }
    current_status_update?: {
        gid: string
        created_at: string
        created_by: {
            gid: string
            name: string
            resource_type: string
        }
        text: string
    }
    default_access_level: string
    default_view: string
    due_on?: string
    due_date?: string
    followers?: {
        gid: string
        name: string
        resource_type: string
    }[]
    members?: {
        gid: string
        name: string
        resource_type: string
    }[]
    minimum_access_level_for_customization: string
    minimum_access_level_for_sharing: string
    modified_at: string
    name: string
    notes: string
    owner: {
        gid: string
        name: string
        resource_type: string
    }
    permalink_url: string
    public: boolean
    resource_type: string
    start_on?: string
    team: {
        gid: string
        name: string
        resource_type: string
    }
    workspace: {
        gid: string
        name: string
        resource_type: string
    }
}

export interface AsanaNotificationProps {
    data: {
        task?: AsanaTask
        comment?: AsanaComment
        project?: AsanaProject
        user: {
            gid: string
            resource_type: string
        }
        created_at: string
        action: string
        resource: {
            gid: string
            resource_type: string
            resource_subtype: string
        }
        parent?: {
            gid: string
            resource_type: string
            resource_subtype: string
        }
        change: {
            field: string
            action: string
        }
    }
    cause: {
        gid: string
        email: string
        name: string
        photo?: {
            image_21x21?: string
            image_27x27?: string
            image_36x36?: string
            image_60x60?: string
            image_128x128?: string
        }
        resource_type: string
        workspaces: {
            gid: string
            name: string
            resource_type: string
        }[]
    }
}

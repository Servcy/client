export interface GithubComment {
    node_id: string;
    html_url: string;
    diff_hunk: string;
    path: string;
    body: string;
    updated_at: string;
    reactions: GithubReactions;
}

export interface GithubReactions {
    url: string;
    total_count: number;
    "+1": number;
    "-1": number;
    laugh: number;
    hooray: number;
    confused: number;
    heart: number;
    rocket: number;
    eyes: number;
}

export interface GithubUser {
    login: string;
    id: number;
    avatar_url: string;
}

export interface GithubMilestone {
    creator: GithubUser;
    id: number;
    node_id: string;
    number: number;
    title: string;
    updated_at: string;
    html_url: string;
    description: string;
    due_on: string | null;
    closed_at: string | null;
    closed_issues: number;
}

export interface GithubIssue {
    active_lock_reason: string;
    assignee?: GithubUser;
    assignees?: GithubUser[];
    author_association: string;
    body?: string;
    closed_at?: string;
    comments: number;
    comments_url: string;
    created_at: string;
    draft: boolean;
    html_url: string;
    id: number;
    labels: {
        color: string;
        name: string;
        id: number;
    }[];
    locked: boolean;
    milestone?: GithubMilestone;
    number: number;
    pull_request?: {
        diff_url?: string;
        html_url?: string;
        patch_url?: string;
        url?: string;
    };
    reactions: GithubReactions;
    repository_url: string;
    state: string;
    state_reason?: string;
    timeline_url: string;
    title: string;
    updated_at: string;
    user: GithubUser;
}

export interface GithubNotificationProps {
    data: {
        action: string;
        enterprise?: object;
        installation: {
            id: number;
            node_id: string;
        };
        organization: {
            login: string;
            id: number;
            node_id: string;
            url: string;
            repos_url: string;
            events_url: string;
            hooks_url: string;
            issues_url: string;
            members_url: string;
            public_members_url: string;
            avatar_url: string;
            description: string;
        };
        pull_request?: {
            title: string;
            html_url: string;
            patch_url: string;
            merged_by: GithubUser;
            draft: boolean;
            diff_url: string;
            state: string;
            closed_at: string | null;
            merged_at: string | null;
            comments: number;
            review_comments: number;
            commits: number;
            additions: number;
            changed_files: number;
            deletions: number;
            assignees: GithubUser[];
            body: string | null;
            requested_reviewers: GithubUser[];
            number: number;
            user: {
                login: string;
                avatar_url: string;
            };
            labels?: {
                name: string;
                id: number;
                color: string;
            }[];
            head: {
                ref: string;
                sha: string;
            };
            base: {
                ref: string;
                sha: string;
            };
            milestone?: GithubMilestone;
            issue_url: string;
        };
        thread?: {
            node_id: string;
            comments: GithubComment[];
        };
        comment?: GithubComment;
        review?: {
            id: number;
            body: string | null;
            submitted_at: string;
            state: string;
            html_url: string;
        };
        projects_v2?: {
            id: number;
            title: string;
            number: number;
            short_description: string;
            owner: GithubUser;
            creator: GithubUser;
        };
        projects_v2_item?: {
            creator: GithubUser;
            id: number;
            node_id: string;
            project_node_id: string;
            content_node_id: string;
            content_type: string;
            created_at: string;
            updated_at: string;
            archived_at: string | null;
        };
        milestone?: GithubMilestone;
        event: string;
        issue?: GithubIssue;
    };
    cause: string;
    timestamp: string;
}

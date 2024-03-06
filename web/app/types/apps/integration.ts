export interface Integration {
    id: number;
    name: string;
    logo: string;
    description: string;
    is_connected: boolean;
    configure_at: string;
}

export interface UserIntegration {
    id: number;
    account_display_name: string;
    account_id: string;
    integration_id: number;
    user_id: number;
    configuration?: {
        team_ids?: string[];
        whitelisted_emails?: string[];
    };
}

export interface IntegrationEvent {
    id: number;
    name: string;
    description: string;
    is_disabled: boolean;
}

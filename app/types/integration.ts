export interface Integration {
  id: number;
  name: string;
  logo: string;
  description: string;
  is_connected: boolean;
  is_wip: boolean;
  configure_at: string; // relative or absolute url
}

export interface UserIntegration {
  id: number;
  account_display_name: string;
  account_id: string;
  integration_id: number;
  user_id: number;
  configuration: string;
}

export interface IntegrationEvent {
  id: number;
  name: string;
  description: string;
  is_disabled: boolean;
}

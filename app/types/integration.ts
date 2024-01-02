export interface Integration {
  id: number;
  name: string;
  logo: string;
  description: string;
  account_display_names: string[];
  is_wip: boolean;
  configure_at: string; // relative or absolute url
}

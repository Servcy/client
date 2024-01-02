export interface Integration {
  id: number;
  name: string;
  logo: string;
  description: string;
  is_connected: boolean;
  is_wip: boolean;
  configure_at: string; // relative or absolute url
}

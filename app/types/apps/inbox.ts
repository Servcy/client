export interface InboxItem {
  id: string;
  created_at: string;
  updated_at: string;
  uid: string;
  title: string;
  source: string;
  body: string;
  is_archived: boolean;
  is_deleted: boolean;
  cause: string;
  is_body_html: boolean;
  account: string;
  i_am_mentioned: boolean;
  user_integration_id: number;
  category: string;
  attachments: string;
  is_read: boolean;
}

export interface Attachment {
  name: string;
  data: string; // bytes string or link
}

export interface PaginationDetails {
  number: number;
  has_previous: boolean;
  has_next: boolean;
  num_pages: number;
  total_items: number;
}

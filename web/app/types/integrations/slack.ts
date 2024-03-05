export interface SlackMessageStyleProps {
  bold?: boolean;
  italic?: boolean;
  strike?: boolean;
  code?: boolean;
}

export interface SlackMessageElementProps {
  type: string;
  style?: SlackMessageStyleProps | string;
  text?: string;
  indent?: number;
  border?: boolean;
  url?: string;
  user_id?: string;
  elements?: SlackMessageElementProps[];
}

export interface SlackMessageProps {
  event_ts: string;
  type: string;
  user?: string;
  ts: string;
  channel: string;
  files?: {
    id: string;
    url_private_download: string;
    name: string;
    url_private: string;
    title: string;
  }[];
  text?: string;
  blocks?: {
    type: string;
    block_id: string;
    elements: SlackMessageElementProps[];
  }[];
  "x-servcy-mentions"?: {
    id: string;
    name: string;
    profile: {
      image_32: string;
    };
  }[];
}

export interface NotionComment {
  object: string;
  id: string;
  parent: {
    type: string;
    page_id: string;
  };
  discussion_id: string;
  created_time: string;
  last_edited_time: string;
  created_by: {
    object: string;
    id: string;
  };
  rich_text: {
    type: string;
    text?: {
      content: string;
      link: string | null;
    };
    mention?: {
      type: string;
      user: {
        object: string;
        id: string;
        name: string;
        avatar_url: string;
        type: string;
        person: {};
      };
    };
    annotations: {
      bold: boolean;
      italic: boolean;
      strikethrough: boolean;
      underline: boolean;
      code: boolean;
      color: string;
    };
    plain_text: string;
    href: string | null;
  }[];
}

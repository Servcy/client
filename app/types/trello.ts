export interface TrelloNotificationProps {
  data: {
    id: string;
    idMemberCreator: string;
    data: {
      text?: string;
      textData?: {
        emoji?: any;
      };
      card: {
        id: string;
        desc?: string;
        name: string;
        idShort: number;
        shortLink: string;
      };
      old?: {
        desc?: string;
        name?: string;
      };
      board: {
        id: string;
        name: string;
        shortLink: string;
      };
      boardSource?: {
        id: string;
      };
      boardTarget?: {
        id: string;
      };
      list: { id: string; name: string };
      attachment?: {
        id: string;
        name: string;
        url: string;
      };
    };
    appCreator?: {
      id: string;
      activityBlocked: false;
      avatarHash: string;
      avatarUrl: string;
      fullName: string;
      idMemberReferrer?: any;
      initials: string;
      nonPublic: any;
      nonPublicAvailable: boolean;
      username: string;
    };
    type: string;
    date: string;
    limits?: {
      reactions: {
        perAction: { status: string; disableAt: number; warnAt: number };
        uniquePerAction: {
          status: string;
          disableAt: number;
          warnAt: number;
        };
      };
    };
    display: {
      translationKey: string;
      entities: {
        contextOn?: {
          type: string;
          translationKey: string;
          hideIfContext: boolean;
          idContext: string;
        };
        card?: {
          type: string;
          hideIfContext: boolean;
          id: string;
          shortLink: string;
          text: string;
          desc: string;
        };
        attachment: {
          type: string;
          id: string;
          link: boolean;
          text: string;
          url: string;
        };
        attachmentPreview: {
          type: string;
          id: string;
          originalUrl: string;
        };
        comment?: {
          type: string;
          text: string;
        };
        list?: {
          type: string;
          id: string;
          text: string;
        };
        board?: {
          type: string;
          id: string;
          text: string;
          shortLink: string;
        };
        memberCreator?: {
          type: string;
          id: string;
          username: string;
          text: string;
        };
      };
    };
    memberCreator: {
      id: string;
      activityBlocked: false;
      avatarHash: string;
      avatarUrl: string;
      fullName: string;
      idMemberReferrer?: any;
      initials: string;
      nonPublic: any;
      nonPublicAvailable: boolean;
      username: string;
    };
  };
  cause: {
    id: string;
    activityBlocked: false;
    avatarHash: string;
    avatarUrl: string;
    fullName: string;
    idMemberReferrer?: any;
    initials: string;
    nonPublic: any;
    nonPublicAvailable: boolean;
    username: string;
  };
}

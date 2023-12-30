export interface TrelloBoard {
  id: string;
  name: string;
  desc?: string;
  shortLink: string;
  descData?: {
    emoji?: any;
  };
  closed?: boolean;
  idMemberCreator?: string;
  idOrganization?: string;
  pinned?: boolean;
  url?: string;
  shortUrl?: string;
  prefs?: object;
  labelNames?: {
    green: string;
    yellow: string;
    orange: string;
    red: string;
    purple: string;
    blue: string;
    sky: string;
    lime: string;
    pink: string;
    black: string;
  };
  limits?: {
    attachments: {
      perBoard: { status: string; disableAt: number; warnAt: number };
      perCard: { status: string; disableAt: number; warnAt: number };
    };
    boards: {
      totalMembersPerBoard: {
        status: string;
        disableAt: number;
        warnAt: number;
      };
    };
    cards: {
      openPerBoard: { status: string; disableAt: number; warnAt: number };
      totalPerBoard: { status: string; disableAt: number; warnAt: number };
    };
    checklists: {
      perBoard: { status: string; disableAt: number; warnAt: number };
    };
    customFields: {
      perBoard: { status: string; disableAt: number; warnAt: number };
    };
    labels: {
      perBoard: { status: string; disableAt: number; warnAt: number };
    };
    lists: {
      openPerBoard: { status: string; disableAt: number; warnAt: number };
      totalPerBoard: { status: string; disableAt: number; warnAt: number };
    };
    stickers: {
      perCard: { status: string; disableAt: number; warnAt: number };
    };
  };
  memberships?: [
    {
      id: string;
      idMember: string;
      memberType: string;
      unconfirmed: boolean;
      deactivated: boolean;
    }
  ];
  enterpriseOwned?: boolean;
  starred?: boolean;
}

export interface TrelloCard {
  id: string;
  checkItemStates?: any;
  closed: boolean;
  dateLastActivity: string;
  desc?: string;
  descData?: {
    emoji?: any;
  };
  dueReminder?: number;
  idBoard: string;
  idList: string;
  idMembersVoted?: any;
  idShort: number;
  idAttachmentCover?: any;
  idLabels?: any;
  manualCoverAttachment: boolean;
  name: string;
  pos: number;
  shortLink: string;
  isTemplate: boolean;
  cardRole?: string;
  badges?: {
    attachmentsByType: {
      trello: {
        board: number;
        card: number;
      };
    };
    location?: boolean;
    votes: number;
    viewingMemberVoted: boolean;
    subscribed: boolean;
    fogbugz: string;
    checkItems: number;
    checkItemsChecked: number;
    checkItemsEarliestDue?: any;
    comments: number;
    attachments: number;
    description: boolean;
    due?: string;
    dueComplete: boolean;
    start?: string;
  };
  dueComplete: boolean;
  due?: string;
  idChecklists?: any;
  idMembers?: any;
  labels?: any;
  shortUrl: string;
  start?: string;
  subscribed: boolean;
  url: string;
  cover?: {
    idAttachment?: any;
    color?: string;
    idUploadedBackground?: any;
    size: string;
    brightness: string;
    idPlugin?: any;
  };
}

export interface TrelloList {
  id: string;
  name: string;
  closed?: boolean;
  idBoard?: string;
  pos?: number;
  subscribed?: boolean;
}

export interface TrelloAttachment {
  id: string;
  url: string;
  name: string;
  bytes?: number;
  date?: string;
  edgeColor?: string;
  idMember?: string;
  isUpload?: boolean;
  mimeType?: string;
  previews?: [
    {
      bytes: number;
      height: number;
      scaled: boolean;
      url: string;
      width: number;
    }
  ];
}

export interface TrelloNotificationProps {
  data: {
    id: string;
    idMemberCreator: string;
    data: {
      text?: string;
      textData?: {
        emoji?: any;
      };
      card: TrelloCard;
      old?: {
        desc?: string;
        name?: string;
      };
      board?: TrelloBoard;
      boardSource?: {
        id: string;
      };
      boardTarget?: {
        id: string;
      };
      checklist?: {
        id: string;
        name: string;
      };
      cardSource?: {
        id: string;
        name: string;
      };
      list?: TrelloList;
      attachment?: TrelloAttachment;
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

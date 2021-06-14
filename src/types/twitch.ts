import dayjs = require('dayjs');

/**=============================
  TOKEN Objects
===============================*/

export class Token {
  token: string | undefined;
  expiresOn: dayjs.Dayjs | undefined;
  type: string | undefined;

  constructor(token?: string, expiresOn?: number, type?: string) {
    this.token = token;
    this.expiresOn = expiresOn ? dayjs().add(expiresOn, 'seconds') : undefined;
    this.type = type;
  }
}

export interface ApiTokenResponseObject {
  access_token: string;
  expires_in: number;
  token_type: string;
}

/**=============================
  User Objects
===============================*/

export class User {
  id: string | undefined;
  loginName: string | undefined;
  displayName: string | undefined;
  type: string | undefined;
  broadcasterType: string | undefined;
  description: string | undefined;
  profileImageUrl: string | undefined;
  offlineImageUrl: string | undefined;
  viewCount: number | undefined;
  createdAt: dayjs.Dayjs | undefined;
}

export interface ApiUserResponseObject {
  data: {
    id: string;
    login: string;
    display_name: string;
    type: string;
    broadcaster_type: string;
    description: string;
    profile_image_url: string;
    offline_image_url: string;
    view_count: number;
    created_at: string;
  }[];
}

/**=============================
  Stream Objects
===============================*/

export class Stream {
  id: string | undefined;
  userId: string | undefined;
  userLoginName: string | undefined;
  username: string | undefined;
  gameId: string | undefined;
  gameName: string | undefined;
  type: string | undefined;
  title: string | undefined;
  viewerCount: number | undefined;
  startedAt: dayjs.Dayjs | undefined;
  language: string | undefined;
  thumbnailUrl: string | undefined;
  tagIds: string[] | undefined;
  isMature: boolean | undefined;
}

export interface ApiStreamResponseObject {
  data: {
    id: string;
    user_id: string;
    user_login: string;
    user_name: string;
    game_id: string;
    game_name: string;
    type: string;
    title: string;
    viewer_count: number;
    started_at: string;
    language: string;
    thumbnail_url: string;
    tag_ids: string[];
    is_mature: boolean;
  }[];
}

/**=============================
  Followers Objects
===============================*/

export class Followers {
  total: number | undefined;
}

export interface ApiFollowersResponseObject {
  total: number | undefined;
  data: {
    from_id: string | undefined;
    from_login: string | undefined;
    from_name: string | undefined;
    to_id: string | undefined;
    to_login: string | undefined;
    to_name: string | undefined;
    followed_at: string | undefined;
  }[];
}

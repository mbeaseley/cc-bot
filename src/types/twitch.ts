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

/**=============================
  Followers Objects
===============================*/

export class Followers {
  total: number | undefined;
}

/**=============================
  whitelist twitch streamers Objects
===============================*/

export interface Streamers {
  userLoginName: string;
  id: string;
}

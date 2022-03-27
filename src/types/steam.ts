import dayjs = require('dayjs');

/**=============================
  Vanity Url User Objects
===============================*/

export class VanityUser {
  steamId: string | undefined;
}

/**=============================
  Player Summary Objects
===============================*/

export const playerStatus = [
  'Offline',
  'Online',
  'Busy',
  'Away',
  'Snooze',
  'Looking to trade',
  'Looking to play',
  'Unknown'
];

export class PlayerSummary {
  steamId: string | undefined;
  communityVisibilityState: number | undefined;
  profileState: number | undefined;
  name: string | undefined;
  commentPermission: number | undefined;
  profileUrl: string | undefined;
  avatar = '';
  avatarMedium = '';
  avatarFull = '';
  avatarHash: string | undefined;
  lastLogOff: dayjs.Dayjs | undefined;
  nameState = playerStatus[7];
  realName: string | undefined;
  PrimaryClanId: string | undefined;
  timeCreated: dayjs.Dayjs | undefined;
  nameStateFlags: number | undefined;
  countryCode: string | undefined;
  stateCode: string | undefined;
  cityId: number | undefined;
  location: SteamLocation | undefined;
}

/**=============================
  Location Objects
===============================*/

export class SteamLocation {
  countryCode: string;
  stateCode: string;
  cityId: number;
  cityName: string;

  constructor(countryCode: string, stateCode: string, cityId: number, cityName: string) {
    this.countryCode = countryCode;
    this.stateCode = stateCode;
    this.cityId = cityId;
    this.cityName = cityName;
  }
}

/**=============================
  User Bans Objects
===============================*/

export class UserBans {
  steamId: string | undefined;
  communityBanned = false;
  vacBanned = false;
  numberOfVACBans = 0;
  daysSinceLastBan = 0;
  numberOfGameBans = 0;
  economyBan: string | undefined;
}

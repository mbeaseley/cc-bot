import dayjs = require('dayjs');

/**=============================
  Vanity Url User Objects
===============================*/

export class VanityUser {
  steamId: string | undefined;
}

export interface ApiVanityUserResponseObject {
  response: {
    steamid: string;
    success: number;
  };
}

/**=============================
  Player Summary Objects
===============================*/

export class PlayerSummary {
  steamId: string | undefined;
  communityVisibilityState: number | undefined;
  profileState: number | undefined;
  name: string | undefined;
  commentPermission: number | undefined;
  ProfileUrl: string | undefined;
  avatar: string[] | undefined;
  avatarHash: string | undefined;
  lastLogOff: dayjs.Dayjs | undefined;
  nameState: number | undefined;
  realName: string | undefined;
  PrimaryClanId: string | undefined;
  timeCreated: dayjs.Dayjs | undefined;
  nameStateFlags: number | undefined;
  countryCode: string | undefined;
  stateCode: string | undefined;
  cityId: number | undefined;
  location: SteamLocation | undefined;
}

export interface ApiPlayerSummaryResponseObject {
  response: {
    players: {
      steamid: string;
      communityvisibilitystate: number;
      profilestate: number;
      personaname: string;
      commentpermission: number;
      profileurl: string;
      avatar: string;
      avatarmedium: string;
      avatarfull: string;
      avatarhash: string;
      lastlogoff: number;
      personastate: number;
      realname: string;
      primaryclanid: string;
      timecreated: number;
      personastateflags: number;
      loccountrycode: string;
      locstatecode: string;
      loccityid: number;
    }[];
  };
}

/**=============================
  Location Objects
  ===============================*/

export class SteamLocation {
  countryCode: string;
  stateCode: string;
  cityId: number;
  cityName: string;

  constructor(
    countryCode: string,
    stateCode: string,
    cityId: number,
    cityName: string
  ) {
    this.countryCode = countryCode;
    this.stateCode = stateCode;
    this.cityId = cityId;
    this.cityName = cityName;
  }
}

export interface ApiLocationResponseObject {
  countrycode: string;
  statecode: string;
  cityid: number;
  cityname: string;
}

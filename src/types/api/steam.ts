export interface ApiVanityUserResponseObject {
  response: {
    steamid: string;
    success: number;
  };
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

export interface ApiLocationResponseObject {
  countrycode: string;
  statecode: string;
  cityid: number;
  cityname: string;
}

export interface ApiUserBanResponseObject {
  players: {
    SteamId: string;
    CommunityBanned: boolean;
    VACBanned: boolean;
    NumberOfVACBans: number;
    DaysSinceLastBan: number;
    NumberOfGameBans: number;
    EconomyBan: string;
  }[];
}

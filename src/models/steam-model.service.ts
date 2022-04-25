import { HttpClient } from 'Interceptor/http-client';
import {
  ApiLocationResponseObject,
  ApiPlayerSummaryResponseObject,
  ApiUserBanResponseObject,
  ApiVanityUserResponseObject
} from 'Types/api/steam';
import { playerStatus, PlayerSummary, SteamLocation, UserBans, VanityUser } from 'Types/steam';
import { environment } from 'Utils/environment';
import { AxiosResponse } from 'axios';
import dayjs = require('dayjs');

export class SteamModelService extends HttpClient {
  constructor() {
    super('');
  }

  /**
   * Get General Response
   * @param endpoint
   * @param queryParams
   */
  private getResponse = <T>(
    endpoint: string,
    queryParams: Record<string, string>
  ): Promise<AxiosResponse<T>> => {
    const qParams = new URLSearchParams(queryParams);
    return this.instance.get<any>(
      `http://api.steampowered.com/ISteamUser/` + endpoint + `?${qParams.toString()}`,
      {
        headers: {
          Accept: 'application/json'
        }
      }
    );
  };

  /**
   * ==================================
   * Fetch Vanity User
   * ==================================
   */

  /**
   * Format response into type
   * @param res
   * @returns VanityUser
   */
  private fromVanityUserPayload(res: ApiVanityUserResponseObject): VanityUser {
    const v = new VanityUser();

    if (res.response) {
      v.steamId = res.response.steamid;
    }

    return v;
  }

  /**
   * Get Vanity Url User
   * @param vanityurl
   */
  public async getVanityUser(vanityurl: string): Promise<VanityUser> {
    const { data } = await this.getResponse<ApiVanityUserResponseObject>(
      'ResolveVanityURL/v0001/',
      {
        key: environment.steamApiKey,
        vanityurl
      }
    );
    return this.fromVanityUserPayload(data);
  }

  /**
   * ==================================
   * Fetch Player Summary
   * ==================================
   */

  /**
   * Format response into type
   * @param res
   * @returns PlayerSummary
   */
  fromPlayerSummaryPayload(res: ApiPlayerSummaryResponseObject): PlayerSummary {
    const p = new PlayerSummary();

    if (res.response?.players.length > 0) {
      const player = res.response.players[0];
      p.steamId = player.steamid;
      p.communityVisibilityState = player.communityvisibilitystate;
      p.profileState = player.profilestate;
      p.name = player.personaname;
      p.commentPermission = player.commentpermission;
      p.profileUrl = player.profileurl;
      p.avatar = player.avatar;
      p.avatarMedium = player.avatarmedium;
      p.avatarFull = player.avatarfull;
      p.avatarHash = player.avatarhash;
      p.lastLogOff = dayjs(player.lastlogoff * 1e3);
      p.nameState = playerStatus[+player.personastate];
      p.realName = player.realname;
      p.PrimaryClanId = player.primaryclanid;
      p.timeCreated = dayjs(player.timecreated * 1e3);
      p.nameStateFlags = player.personastateflags;
      p.countryCode = player.loccountrycode;
      p.stateCode = player.locstatecode;
      p.cityId = player.loccityid;
    }

    return p;
  }

  /**
   * Get Player Summary
   * @param steamId
   */
  public async getPlayerSummary(steamId: string): Promise<PlayerSummary> {
    const { data } = await this.getResponse<ApiPlayerSummaryResponseObject>(
      'GetPlayerSummaries/v0002/',
      {
        key: environment.steamApiKey,
        steamids: steamId
      }
    );
    return this.fromPlayerSummaryPayload(data);
  }

  /**
   * ==================================
   * Fetch Player Location
   * ==================================
   */

  /**
   * Format into correct type
   * @param res
   */
  fromLocationPayload(res: ApiLocationResponseObject[]): SteamLocation[] {
    return (
      res?.map((r) => new SteamLocation(r.countrycode, r.statecode, r.cityid, r.cityname)) || []
    );
  }

  /**
   * Get all possible locations
   * @param countryCode
   * @param stateCode
   */
  getPossibleLocations = (
    countryCode: string,
    stateCode: string
  ): Promise<AxiosResponse<ApiLocationResponseObject[]>> => {
    return this.instance.get<ApiLocationResponseObject[]>(
      `https://steamcommunity.com/actions/QueryLocations/${countryCode}/${stateCode}`,
      {
        headers: {
          Accept: 'application/json'
        }
      }
    );
  };

  /**
   * Get Player Location
   * @param playerSummary
   * @returns PlayerSummary
   */
  public async getPlayerLocation(playerSummary: PlayerSummary): Promise<PlayerSummary> {
    if (!playerSummary?.countryCode || !playerSummary?.stateCode) {
      return playerSummary;
    }

    const { data } = await this.getPossibleLocations(
      playerSummary.countryCode,
      playerSummary.stateCode
    );
    const locations = this.fromLocationPayload(data);
    playerSummary.location = locations.find((l) => l.cityId === playerSummary.cityId) || undefined;

    return Promise.resolve(playerSummary);
  }

  /**
   * ==================================
   * Fetch User Bans
   * ==================================
   */

  /**
   * Format into correct type
   * @param res
   * @returns UserBans
   */
  private fromUserBansPayload(res: ApiUserBanResponseObject): UserBans {
    const u = new UserBans();

    if (res.players.length > 0) {
      u.steamId = res.players[0].SteamId;
      u.communityBanned = res.players[0].CommunityBanned;
      u.vacBanned = res.players[0].VACBanned;
      u.numberOfVACBans = res.players[0].NumberOfVACBans;
      u.daysSinceLastBan = res.players[0].DaysSinceLastBan;
      u.numberOfGameBans = res.players[0].NumberOfGameBans;
      u.economyBan = res.players[0].EconomyBan;
    }

    return u;
  }

  /**
   * Get Steam User Bans
   * @param steamId
   */
  public async getUserBans(steamId: string): Promise<UserBans> {
    const { data } = await this.getResponse<ApiUserBanResponseObject>('GetPlayerBans/v1/', {
      key: environment.steamApiKey,
      steamids: steamId
    });
    return this.fromUserBansPayload(data);
  }
}

export const steamModelService = new SteamModelService();

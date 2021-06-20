import { HttpClient } from '../interceptor/httpClient';
import { AxiosResponse } from 'axios';
import { environment } from '../utils/environment';
import {
  ApiLocationResponseObject,
  ApiPlayerSummaryResponseObject,
  ApiVanityUserResponseObject,
  PlayerSummary,
  SteamLocation,
  VanityUser,
} from '../types/steam';
import dayjs = require('dayjs');

export class SteamModelService extends HttpClient {
  /**
   * Get General Response
   * @param endpoint
   * @param queryParams
   */
  private getResponse = (
    endpoint: string,
    queryParams: Record<string, string>
  ): Promise<AxiosResponse<any>> => {
    const qParams = new URLSearchParams(queryParams);
    return this.instance.get<any>(
      `http://api.steampowered.com/ISteamUser/` +
        endpoint +
        `?${qParams.toString()}`,
      {
        headers: {
          Accept: 'application/json',
        },
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
    const res = (await this.getResponse('ResolveVanityURL/v0001/', {
      key: environment.steamApiKey,
      vanityurl,
    })) as ApiVanityUserResponseObject;
    return this.fromVanityUserPayload(res);
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
      p.ProfileUrl = player.profileurl;
      p.avatar = [player.avatar, player.avatarmedium, player.avatarfull];
      p.avatarHash = player.avatarhash;
      p.lastLogOff = dayjs(player.lastlogoff * 1e3);
      p.nameState = player.personastate;
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
    const res = (await this.getResponse('GetPlayerSummaries/v0002/', {
      key: environment.steamApiKey,
      steamids: steamId,
    })) as ApiPlayerSummaryResponseObject;
    return this.fromPlayerSummaryPayload(res);
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
      res?.map(
        (r) =>
          new SteamLocation(r.countrycode, r.statecode, r.cityid, r.cityname)
      ) || []
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
          Accept: 'application/json',
        },
      }
    );
  };

  /**
   * Get Player Location
   * @param playerSummary
   * @returns PlayerSummary
   */
  public async getPlayerLocation(
    playerSummary: PlayerSummary
  ): Promise<PlayerSummary> {
    if (!playerSummary?.countryCode || !playerSummary?.stateCode) {
      return playerSummary;
    }

    const res = await this.getPossibleLocations(
      playerSummary.countryCode,
      playerSummary.stateCode
    );
    const locations = this.fromLocationPayload(res);
    playerSummary.location =
      locations.find((l) => l.cityId === playerSummary.cityId) || undefined;

    return Promise.resolve(playerSummary);
  }
}

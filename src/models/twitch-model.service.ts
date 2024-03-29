import { HttpClient } from 'Interceptor/http-client';
import { databaseService } from 'Services/database.service';
import {
  ApiFollowersResponseObject,
  ApiStreamResponseObject,
  ApiTokenResponseObject,
  ApiUserResponseObject,
  ApiWatchlistStreamersObject
} from 'Types/api/twitch';
import { TwitchCollection } from 'Types/database';
import { Followers, Stream, Streamers, Token, User } from 'Types/twitch';
import { environment } from 'Utils/environment';
import { AxiosResponse } from 'axios';
import dayjs = require('dayjs');
import { Guild } from 'discord.js';

class TwitchModelService extends HttpClient {
  private _token: Token | undefined;

  constructor() {
    super('');
  }

  /**
   * ==================================
   * Fetch Token
   * ==================================
   */

  /**
   * Get token
   */
  private get token() {
    return this._token ?? new Token();
  }

  /**
   * Set token
   */
  private set token(value: Token) {
    this._token = value;
  }

  /**
   * Format token response into type
   * @param res
   * @returns Token
   */
  private fromTokenPayload(res: ApiTokenResponseObject): Token {
    return new Token(res.access_token, res.expires_in, res.token_type);
  }

  /**
   * Get Token Response
   */
  private getTokenResponse = (): Promise<AxiosResponse<ApiTokenResponseObject>> => {
    return this.instance.post<ApiTokenResponseObject>(
      `https://id.twitch.tv/oauth2/token?client_id=${environment.twitchClientId}&client_secret=${environment.twitchSecret}&grant_type=client_credentials&scope=user:read:email`
    );
  };

  /**
   * Get Token response
   */
  async getToken(): Promise<Token> {
    const { data } = await this.getTokenResponse();
    this.token = this.fromTokenPayload(data);
    return this.token;
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
      `https://api.twitch.tv/helix/` + endpoint + `?${qParams.toString()}`,
      {
        headers: {
          Accept: 'application/json',
          'Client-ID': environment.twitchClientId,
          Authorization: `Bearer ${this.token.token}`
        }
      }
    );
  };

  /**
   * ==================================
   * Fetch User
   * ==================================
   */

  /**
   * Format User response into type
   * @param res
   * @returns User
   */
  private fromUserPayload(res: ApiUserResponseObject): User {
    const u = new User();

    if (res.data.length > 0) {
      u.id = res.data[0].id;
      u.loginName = res.data[0].login;
      u.displayName = res.data[0].display_name;
      u.type = res.data[0].type;
      u.broadcasterType = res.data[0].broadcaster_type;
      u.description = res.data[0].description;
      u.profileImageUrl = res.data[0].profile_image_url;
      u.offlineImageUrl = res.data[0].offline_image_url;
      u.viewCount = res.data[0].view_count;
      u.createdAt = dayjs(res.data[0].created_at);
    }

    return u;
  }

  /**
   * Get User
   * @param login
   */
  public async getUser(login: string): Promise<User> {
    if (!this.token?.expiresOn || this.token?.expiresOn?.isBefore(dayjs())) {
      await this.getToken();
    }

    const { data } = await this.getResponse<ApiUserResponseObject>('users', {
      login
    });
    return this.fromUserPayload(data);
  }

  /**
   * ==================================
   * Fetch Streams
   * ==================================
   */

  /**
   * Format Stream response into type
   * @param res
   * @returns Stream
   */
  private fromStreamPayload(res: ApiStreamResponseObject): Stream | undefined {
    if (res.data.length > 0) {
      const s = new Stream();
      s.id = res.data[0].id;
      s.userId = res.data[0].user_id;
      s.userLoginName = res.data[0].user_login;
      s.username = res.data[0].user_name;
      s.gameId = res.data[0].game_id;
      s.gameName = res.data[0].game_name;
      s.type = res.data[0].type;
      s.title = res.data[0].title;
      s.viewerCount = res.data[0].viewer_count;
      s.startedAt = dayjs(res.data[0].started_at);
      s.language = res.data[0].language;
      s.thumbnailUrl = res.data[0].thumbnail_url
        .replace('{width}', '400')
        .replace('{height}', '225');
      s.thumbnailUrl += `?r=${s.gameId}`;
      s.tagIds = res.data[0].tag_ids;
      s.isMature = res.data[0].is_mature;

      return s;
    }
  }

  /**
   * Get Stream
   * @param username
   */
  public async getStreams(username: string): Promise<any> {
    if (!this.token?.expiresOn || this.token?.expiresOn?.isBefore(dayjs())) {
      await this.getToken();
    }

    const { data } = await this.getResponse<ApiStreamResponseObject>('streams', {
      user_login: username
    });
    return this.fromStreamPayload(data);
  }

  /**
   * ==================================
   * Fetch User Follows
   * ==================================
   */

  /**
   * Format Followers response into type
   * @param res
   * @returns Followers
   */
  private fromFollowersPayload(res: ApiFollowersResponseObject): Followers {
    const f = new Followers();
    f.total = res.total;
    return f;
  }

  /**
   * Get Followers Of User
   * @param id
   */
  public async getFollowersById(id: string): Promise<Followers> {
    if (!this.token?.expiresOn || this.token?.expiresOn?.isBefore(dayjs())) {
      await this.getToken();
    }

    const { data } = await this.getResponse<ApiFollowersResponseObject>('users/follows', {
      to_id: id
    });
    return this.fromFollowersPayload(data);
  }

  /**
   * ==================================
   * Fetch streamer
   * ==================================
   */

  /**
   * Get watchlist channels
   * @returns string[]
   */
  public async getDBStoredChannels(guild: Guild): Promise<Streamers[]> {
    const res = (await databaseService.get(
      'twitch',
      guild.id as TwitchCollection
    )) as ApiWatchlistStreamersObject[];

    return res.map((r) => {
      return {
        userLoginName: r.user_login,
        id: r.member_id
      };
    });
  }
}

export const twitchModelService = new TwitchModelService();

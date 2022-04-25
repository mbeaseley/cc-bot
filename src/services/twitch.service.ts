import { twitchModelService } from 'Models/twitch-model.service';
import { Followers, Stream, User } from 'Types/twitch';

export class TwitchService {
  /**
   * Get User
   * @returns Promise<User>
   */
  public async getUser(name: string): Promise<User> {
    return twitchModelService.getUser(name);
  }

  /**
   * Get Streams
   * @returns Promise<Stream>
   */
  public async getStreams(username: string): Promise<Stream> {
    return twitchModelService.getStreams(username);
  }

  /**
   * Get Followers by id
   * @returns Promise<Followers>
   */
  public async getFollowersById(id: string): Promise<Followers> {
    return twitchModelService.getFollowersById(id);
  }
}

export const twitchService = new TwitchService();

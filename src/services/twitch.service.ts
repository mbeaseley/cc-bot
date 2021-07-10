import { TwitchModelService } from 'Models/twitch-model.service';
import { Followers, Stream, User } from 'Types/twitch';

export class TwitchService {
  private twitchModelService: TwitchModelService;

  constructor() {
    this.twitchModelService = new TwitchModelService('');
  }

  /**
   * Get User
   * @returns Promise<User>
   */
  public async getUser(name: string): Promise<User> {
    return this.twitchModelService.getUser(name);
  }

  /**
   * Get Streams
   * @returns Promise<Stream>
   */
  public async getStreams(username: string): Promise<Stream> {
    return this.twitchModelService.getStreams(username);
  }

  /**
   * Get Followers by id
   * @returns Promise<Followers>
   */
  public async getFollowersById(id: string): Promise<Followers> {
    return this.twitchModelService.getFollowersById(id);
  }
}

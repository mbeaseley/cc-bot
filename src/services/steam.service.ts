import { SteamModelService } from '../models/steam-model.service';
import { PlayerSummary, VanityUser } from '../types/steam';

export class SteamService {
  private steamModelService: SteamModelService;

  constructor() {
    this.steamModelService = new SteamModelService('');
  }

  /**
   * Get Vanity Url User
   * @param vanityurl
   * @returns Promise<VanityUser>
   */
  public async getVanityUser(vanityUrl: string): Promise<VanityUser> {
    return this.steamModelService.getVanityUser(vanityUrl);
  }

  /**
   * Get Player Summary
   * @param steamId
   * @returns PlayerSummary
   */
  public async getPlayerSummary(steamId: string): Promise<PlayerSummary> {
    const ps = await this.steamModelService.getPlayerSummary(steamId);
    return this.steamModelService.getPlayerLocation(ps);
  }
}

import { steamModelService } from 'Models/steam-model.service';
import { PlayerSummary, UserBans, VanityUser } from 'Types/steam';

class SteamService {
  /**
   * Get Vanity Url User
   * @param vanityurl
   * @returns Promise<VanityUser>
   */
  public async getVanityUser(vanityUrl: string): Promise<VanityUser> {
    return steamModelService.getVanityUser(vanityUrl);
  }

  /**
   * Get Player Summary
   * @param steamId
   * @returns PlayerSummary
   */
  public async getPlayerSummary(steamId: string): Promise<PlayerSummary> {
    const ps = await steamModelService.getPlayerSummary(steamId);
    return steamModelService.getPlayerLocation(ps);
  }

  /**
   * Get User Bans
   * @param steamId
   * @returns UserBans
   */
  public async getUserBans(steamId: string): Promise<UserBans> {
    return steamModelService.getUserBans(steamId);
  }
}

export const steamService = new SteamService();

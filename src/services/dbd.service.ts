import { dbdModelService } from 'Models/dbd-model.service';
import {
  KillerItem,
  KillerOffering,
  PlayerKiller,
  SurvivorLoot,
  SurvivorOffering
} from 'Types/dbd';
import Utility from 'Utils/utility';

export class DBDService {
  /**
   * Fetch Player Killers
   * @returns PlayerKiller[]
   */
  public async getPlayerKillers(): Promise<PlayerKiller[]> {
    return dbdModelService.getPlayerKillers();
  }

  /**
   * Fetch Killers
   * @returns KillerItem[]
   */
  public async getKillers(): Promise<KillerItem[]> {
    return dbdModelService.getKillers();
  }

  /**
   * Fetch Killer Perks
   * @returns string[]
   */
  public async getKillerPerks(): Promise<string[]> {
    return dbdModelService.getKillerPerks();
  }

  /**
   * Fetch Killer Offerings
   * @returns KillerOffering[]
   */
  public async getKillerOfferings(): Promise<KillerOffering[]> {
    return dbdModelService.getKillerOfferings();
  }

  /**
   * Fetch Survivor Perks
   * @returns string[]
   */
  public async getSurvivorPerks(): Promise<string[]> {
    return dbdModelService.getSurvivorPerks();
  }

  /**
   * Fetch Survivor Loot
   * @returns SurvivorLoot[]
   */
  public async getSurvivorLoot(): Promise<SurvivorLoot[]> {
    return dbdModelService.getSurvivorLoot();
  }

  /**
   * Fetch Survivor Offerings
   * @returns SurvivorOffering[]
   */
  public async getSurvivorOfferings(): Promise<SurvivorOffering[]> {
    return dbdModelService.getSurvivorOfferings();
  }

  /**
   * Get Killer Challenges
   * @returns string[]
   */
  public async getKillerChallenges(): Promise<string[]> {
    return dbdModelService.getKillerChallenges();
  }

  /**
   * Get Single Killer Challenges
   * @returns string[]
   */
  public async getKillerChallenge(): Promise<string | undefined> {
    const challenges = await dbdModelService.getKillerChallenges();
    return challenges.length ? Utility.random(challenges) : undefined;
  }

  /**
   * Get Survivor Challenges
   * @returns string[]
   */
  public async getSurvivorChallenges(): Promise<string[]> {
    return dbdModelService.getSurvivorChallenges();
  }

  /**
   * Get Single Survivor Challenges
   * @returns string[]
   */
  public async getSurvivorChallenge(): Promise<string | undefined> {
    const challenges = await dbdModelService.getSurvivorChallenges();
    return challenges.length ? Utility.random(challenges) : undefined;
  }
}

export const dbdService = new DBDService();

import { DBDModelService } from 'Models/dbd-model.service';
import {
  KillerItem,
  KillerOffering,
  PlayerKiller,
  SurvivorLoot,
  SurvivorOffering
} from 'Types/dbd';
import Utility from 'Utils/utility';

export class DBDService {
  private dbdModelService: DBDModelService;

  constructor() {
    this.dbdModelService = new DBDModelService();
  }

  /**
   * Fetch Player Killers
   * @returns PlayerKiller[]
   */
  public async getPlayerKillers(): Promise<PlayerKiller[]> {
    return this.dbdModelService.getPlayerKillers();
  }

  /**
   * Fetch Killers
   * @returns KillerItem[]
   */
  public async getKillers(): Promise<KillerItem[]> {
    return this.dbdModelService.getKillers();
  }

  /**
   * Fetch Killer Perks
   * @returns string[]
   */
  public async getKillerPerks(): Promise<string[]> {
    return this.dbdModelService.getKillerPerks();
  }

  /**
   * Fetch Killer Offerings
   * @returns KillerOffering[]
   */
  public async getKillerOfferings(): Promise<KillerOffering[]> {
    return this.dbdModelService.getKillerOfferings();
  }

  /**
   * Fetch Survivor Perks
   * @returns string[]
   */
  public async getSurvivorPerks(): Promise<string[]> {
    return this.dbdModelService.getSurvivorPerks();
  }

  /**
   * Fetch Survivor Loot
   * @returns SurvivorLoot[]
   */
  public async getSurvivorLoot(): Promise<SurvivorLoot[]> {
    return this.dbdModelService.getSurvivorLoot();
  }

  /**
   * Fetch Survivor Offerings
   * @returns SurvivorOffering[]
   */
  public async getSurvivorOfferings(): Promise<SurvivorOffering[]> {
    return this.dbdModelService.getSurvivorOfferings();
  }

  /**
   * Get Killer Challenges
   * @returns string[]
   */
  public async getKillerChallenges(): Promise<string[]> {
    return this.dbdModelService.getKillerChallenges();
  }

  /**
   * Get Single Killer Challenges
   * @returns string[]
   */
  public async getKillerChallenge(): Promise<string | undefined> {
    const challenges = await this.dbdModelService.getKillerChallenges();
    return challenges.length ? Utility.random(challenges) : undefined;
  }

  /**
   * Get Survivor Challenges
   * @returns string[]
   */
  public async getSurvivorChallenges(): Promise<string[]> {
    return this.dbdModelService.getSurvivorChallenges();
  }

  /**
   * Get Single Survivor Challenges
   * @returns string[]
   */
  public async getSurvivorChallenge(): Promise<string | undefined> {
    const challenges = await this.dbdModelService.getSurvivorChallenges();
    return challenges.length ? Utility.random(challenges) : undefined;
  }
}

export const dbdService = new DBDService();

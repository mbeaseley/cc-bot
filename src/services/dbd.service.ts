import { DBDModelService } from '../models/dbd-model.service';
import {
  KillerItem,
  KillerOffering,
  PlayerKiller,
  SurvivorLoot,
  SurvivorOffering,
} from '../types/dbd';

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
}

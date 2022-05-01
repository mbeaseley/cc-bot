import { databaseService } from 'Services/database.service';
import {
  ApiChallenge,
  ApiKillerOffering,
  ApiKillerPerk,
  ApiKillers,
  ApiPlayerKillers,
  ApiSurvivorLoot,
  ApiSurvivorOffering,
  ApiSurvivorPerk
} from 'Types/api/dbd';
import { DBDCollections } from 'Types/database';
import {
  KillerAddon,
  KillerItem,
  KillerOffering,
  PlayerKiller,
  SurvivorAddon,
  SurvivorLoot,
  SurvivorOffering
} from 'Types/dbd';

class DBDModelService {
  private _killers: KillerItem[] | undefined;
  private _killerPerks: string[] | undefined;
  private _killerOfferings: KillerOffering[] | undefined;
  private _survivorPerks: string[] | undefined;
  private _survivorLoot: SurvivorLoot[] | undefined;
  private _survivorOffering: SurvivorOffering[] | undefined;
  private _playerKillers: PlayerKiller[] | undefined;
  private _killerChallenges: string[] = [];
  private _survivorChallenges: string[] = [];

  /**
   * ==================================
   * Fetch Player Available Killers
   * ==================================
   */

  /**
   * Get Player Killers
   */
  private get playerKillers() {
    return this._playerKillers ?? [];
  }

  /**
   * Set Player Killers
   */
  private set playerKillers(value: PlayerKiller[]) {
    this._playerKillers = value;
  }

  /**
   * Format player killers into PlayerKiller type
   * @param res
   * @returns PlayerKiller[]
   */
  private fromPlayerKillerPayload(res: ApiPlayerKillers[]): PlayerKiller[] {
    return res.map((r) => new PlayerKiller(r.user_id, r.available_killers));
  }

  /**
   * Get Player Killers
   * @returns PlayerKiller[]
   */
  public async getPlayerKillers(): Promise<PlayerKiller[]> {
    if (this.playerKillers.length) {
      return Promise.resolve(this.playerKillers);
    }

    const res = await databaseService.get<any, ApiPlayerKillers>(
      'dbd',
      DBDCollections.playerKillers
    );
    this.playerKillers = this.fromPlayerKillerPayload(res);
    return Promise.resolve(this.playerKillers);
  }

  /**
   * ==================================
   * Fetch Killers
   * ==================================
   */

  /**
   * Get Killers
   */
  private get killers() {
    return this._killers ?? [];
  }

  /**
   * Set Killers
   */
  private set killers(value: KillerItem[]) {
    this._killers = value;
  }

  /**
   * Format Killers into KillerItem types
   * @param res
   * @returns KillerItem[]
   */
  private fromKillersPayload(res: ApiKillers[]): KillerItem[] {
    return res.map((r) => {
      const k = new KillerItem(r.id, r.name, r.image);
      k.addons = r.addons.map((ra) => new KillerAddon(ra.name, ra.rarity));
      return k;
    });
  }

  /**
   * Get killerItems
   * @returns KillerItem[]
   */
  public async getKillers(): Promise<KillerItem[]> {
    if (this.killers.length) {
      return Promise.resolve(this.killers);
    }

    const res = await databaseService.get<any, ApiKillers>('dbd', DBDCollections.killers);
    this.killers = this.fromKillersPayload(res);
    return Promise.resolve(this.killers);
  }

  /**
   * ==================================
   * Fetch Killer Perks
   * ==================================
   */

  /**
   * Get Killers
   */
  private get killerPerks() {
    return this._killerPerks ?? [];
  }

  /**
   * Set Killers
   */
  private set killerPerks(value: string[]) {
    this._killerPerks = value;
  }

  /**
   * Format Killers perks into string array
   * @param res
   * @returns string[]
   */
  private fromKillerPerksPayload(res: ApiKillerPerk[]): string[] {
    return res.map((r) => r.perk);
  }

  /**
   * Get killer Perks
   * @returns string[]
   */
  public async getKillerPerks(): Promise<string[]> {
    if (this.killerPerks.length) {
      return Promise.resolve(this.killerPerks);
    }

    const res = await databaseService.get<any, ApiKillerPerk>('dbd', DBDCollections.killerPerks);
    this.killerPerks = this.fromKillerPerksPayload(res);
    return Promise.resolve(this.killerPerks);
  }

  /**
   * ==================================
   * Fetch Killer Perks
   * ==================================
   */

  /**
   * Get Killers
   */
  private get killerOfferings() {
    return this._killerOfferings ?? [];
  }

  /**
   * Set Killers
   */
  private set killerOfferings(value: KillerOffering[]) {
    this._killerOfferings = value;
  }

  /**
   * Format Killers offerings into string array
   * @param res
   * @returns string[]
   */
  private fromKillerOfferingsPayload(res: ApiKillerOffering[]): KillerOffering[] {
    return res.map((r) => new KillerOffering(r.name, r.rarity));
  }

  /**
   * Get killer Perks
   * @returns string[]
   */
  public async getKillerOfferings(): Promise<KillerOffering[]> {
    if (this.killerOfferings.length) {
      return Promise.resolve(this.killerOfferings);
    }

    const res = await databaseService.get<any, ApiKillerOffering>(
      'dbd',
      DBDCollections.killerOfferings
    );
    this.killerOfferings = this.fromKillerOfferingsPayload(res);
    return Promise.resolve(this.killerOfferings);
  }

  /**
   * ==================================
   * Fetch Survivor Perks
   * ==================================
   */

  /**
   * Get survivor perks
   */
  private get survivorPerks() {
    return this._survivorPerks ?? [];
  }

  /**
   * Set survivor perks
   */
  private set survivorPerks(value: string[]) {
    this._survivorPerks = value;
  }

  /**
   * Format survivor perks into string array
   * @param res
   * @returns string[]
   */
  private fromSurvivorPerksPayload(res: ApiSurvivorPerk[]): string[] {
    return res.map((r) => r.perk);
  }

  /**
   * Get Survivor Perks
   * @returns string[]
   */
  public async getSurvivorPerks(): Promise<string[]> {
    if (this.survivorPerks.length) {
      return Promise.resolve(this.survivorPerks);
    }

    const res = await databaseService.get<any, ApiSurvivorPerk>(
      'dbd',
      DBDCollections.survivorPerks
    );
    this.survivorPerks = this.fromSurvivorPerksPayload(res);
    return Promise.resolve(this.survivorPerks);
  }

  /**
   * ==================================
   * Fetch Survivor Loot
   * ==================================
   */

  /**
   * Get survivor loot
   */
  private get survivorLoot() {
    return this._survivorLoot ?? [];
  }

  /**
   * Set survivor loot
   */
  private set survivorLoot(value: SurvivorLoot[]) {
    this._survivorLoot = value;
  }

  /**
   * Format survivor loot into array
   * @param res
   * @returns SurvivorLoot[]
   */
  private fromSurvivorLootPayload(res: ApiSurvivorLoot[]): SurvivorLoot[] {
    return res.map((r) => {
      const s = new SurvivorLoot(r.name, r.rarity);
      s.addons = r.addons.map((a) => new SurvivorAddon(a.name, a.rarity));
      return s;
    });
  }

  /**
   * Get Survivor Loot
   * @returns string[]
   */
  public async getSurvivorLoot(): Promise<SurvivorLoot[]> {
    if (this.survivorLoot.length) {
      return Promise.resolve(this.survivorLoot);
    }

    const res = await databaseService.get<any, ApiSurvivorLoot>(
      'dbd',
      DBDCollections.survivorLoots
    );
    this.survivorLoot = this.fromSurvivorLootPayload(res);
    return Promise.resolve(this.survivorLoot);
  }

  /**
   * ==================================
   * Fetch Survivor Offering
   * ==================================
   */

  /**
   * Get survivor offerings
   */
  private get survivorOfferings() {
    return this._survivorOffering ?? [];
  }

  /**
   * Set survivor offerings
   */
  private set survivorOfferings(value: SurvivorOffering[]) {
    this._survivorOffering = value;
  }

  /**
   * Format survivor offerings into array
   * @param res
   * @returns SuvivorOffering[]
   */
  private fromSurvivorOfferingsPayload(res: ApiSurvivorOffering[]): SurvivorOffering[] {
    return res.map((r) => new SurvivorOffering(r.name, r.rarity));
  }

  /**
   * Get Survivor Offerings
   * @returns string[]
   */
  public async getSurvivorOfferings(): Promise<SurvivorOffering[]> {
    if (this.survivorOfferings.length) {
      return Promise.resolve(this.survivorOfferings);
    }

    const res = await databaseService.get<any, ApiSurvivorOffering>(
      'dbd',
      DBDCollections.survivorOfferings
    );
    this.survivorOfferings = this.fromSurvivorOfferingsPayload(res);
    return Promise.resolve(this.survivorOfferings);
  }

  /**
   * ==================================
   * Fetch Challenges
   * ==================================
   */

  /**
   * Get killer challenges
   */
  private get killerChallenges() {
    return this._killerChallenges;
  }

  /**
   * Set killer challenges
   */
  private set killerChallenges(value: string[]) {
    this._killerChallenges = value;
  }

  /**
   * Format challenge payload
   * @param res
   * @returns string[]
   */
  fromChallengePayload(res: ApiChallenge[]): string[] {
    return res.map((r) => r.challenge) ?? [];
  }

  /**
   * Get killer challenges
   * @returns promise<string[]>
   */
  public async getKillerChallenges(): Promise<string[]> {
    if (this.killerChallenges.length) {
      return Promise.resolve(this.killerChallenges);
    }

    const res = await databaseService.get<any, ApiChallenge>(
      'dbd',
      DBDCollections.killerChallenges
    );
    this.killerChallenges = this.fromChallengePayload(res);
    return Promise.resolve(this.killerChallenges);
  }

  /**
   * Get survivor challenges
   */
  private get survivorChallenges() {
    return this._survivorChallenges;
  }

  /**
   * Set survivor challenges
   */
  private set survivorChallenges(value: string[]) {
    this._survivorChallenges = value;
  }

  /**
   * Get survivor challenges
   * @returns promise<string[]>
   */
  public async getSurvivorChallenges(): Promise<string[]> {
    if (this.survivorChallenges.length) {
      return Promise.resolve(this.survivorChallenges);
    }

    const res = await databaseService.get<any, ApiChallenge>(
      'dbd',
      DBDCollections.survivorChallenges
    );
    this.survivorChallenges = this.fromChallengePayload(res);
    return Promise.resolve(this.survivorChallenges);
  }
}

export const dbdModelService = new DBDModelService();

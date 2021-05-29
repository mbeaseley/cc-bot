import { DatabaseService } from '../services/database.service';
import { DBDCollections } from '../types/database';
import { KillerAddon, KillerItem, KillerOffering } from '../types/dbd';

export class DBDModelService {
  private databaseService: DatabaseService;
  private _killers: KillerItem[] | undefined;
  private _killerPerks: string[] | undefined;
  private _killerOfferings: KillerOffering[] | undefined;

  constructor() {
    this.databaseService = new DatabaseService();
  }

  /**
   * ==================================
   * Fetch Killers
   * ==================================
   */

  /**
   * Get Killers
   */
  get Killers() {
    return this._killers ?? [];
  }

  /**
   * Set Killers
   */
  set Killers(value: KillerItem[]) {
    this._killers = value;
  }

  /**
   * Format Killers into KillerItem types
   * @param res
   * @returns KillerItem[]
   */
  fromKillersPayload(
    res: {
      id: number;
      name: string;
      image: string;
      addons: { name: string; rarity: string }[];
    }[]
  ): KillerItem[] {
    return res.map((r) => {
      const k = new KillerItem();
      k.id = r.id;
      k.name = r.name;
      k.image = r.image;
      k.addons = r.addons.map((ra: { name: string; rarity: string }) => {
        const a = new KillerAddon();
        a.name = ra.name;
        a.rarity = ra.rarity;
        return a;
      });
      return k;
    });
  }

  /**
   * Get killerItems
   * @returns KillerItem[]
   */
  async getKillers(): Promise<KillerItem[]> {
    if (this.Killers.length) {
      return Promise.resolve(this.Killers);
    }

    const res = await this.databaseService.connect(
      'dbd',
      DBDCollections.killers
    );
    this.Killers = this.fromKillersPayload(res);

    return Promise.resolve(this.Killers);
  }

  /**
   * ==================================
   * Fetch Killer Perks
   * ==================================
   */

  /**
   * Get Killers
   */
  get KillerPerks() {
    return this._killerPerks ?? [];
  }

  /**
   * Set Killers
   */
  set KillerPerks(value: string[]) {
    this._killerPerks = value;
  }

  /**
   * Format Killers perks into string array
   * @param res
   * @returns string[]
   */
  fromKillerPerksPayload(res: { perk: string }[]): string[] {
    return res.map((r) => r.perk);
  }

  /**
   * Get killer Perks
   * @returns string[]
   */
  async getKillerPerks(): Promise<string[]> {
    if (this.KillerPerks.length) {
      return Promise.resolve(this.KillerPerks);
    }

    const res = await this.databaseService.connect(
      'dbd',
      DBDCollections.killerPerks
    );
    this.KillerPerks = this.fromKillerPerksPayload(res);
    return Promise.resolve(this.KillerPerks);
  }

  /**
   * ==================================
   * Fetch Killer Perks
   * ==================================
   */
  /**
   * Get Killers
   */
  get KillerOfferings() {
    return this._killerOfferings ?? [];
  }

  /**
   * Set Killers
   */
  set KillerOfferings(value: KillerOffering[]) {
    this._killerOfferings = value;
  }

  /**
   * Format Killers offerings into string array
   * @param res
   * @returns string[]
   */
  fromKillerOfferingsPayload(
    res: { name: string; rarity: string }[]
  ): KillerOffering[] {
    return res.map((r) => {
      const k = new KillerOffering();
      k.name = r.name;
      k.rarity = r.rarity;
      return k;
    });
  }

  /**
   * Get killer Perks
   * @returns string[]
   */
  async getKillerOfferings(): Promise<KillerOffering[]> {
    if (this.KillerOfferings.length) {
      return Promise.resolve(this.KillerOfferings);
    }

    const res = await this.databaseService.connect(
      'dbd',
      DBDCollections.killerOfferings
    );
    this.KillerOfferings = this.fromKillerOfferingsPayload(res);
    return Promise.resolve(this.KillerOfferings);
  }
}

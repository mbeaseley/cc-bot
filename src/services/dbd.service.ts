import { KillerItem, KillerOffering } from 'src/types/dbd';
import { DBDModelService } from '../models/dbd-model.service';

export class DBDService {
  private dbdModelService: DBDModelService;

  constructor() {
    this.dbdModelService = new DBDModelService();
  }

  /**
   * Fetch Killers
   */
  public async getKillers(): Promise<KillerItem[]> {
    return this.dbdModelService.getKillers();
  }

  /**
   * Fetch Killer Perks
   */
  public async getKillerPerks(): Promise<string[]> {
    return this.dbdModelService.getKillerPerks();
  }

  /**
   * Fetch Killer Offerings
   */
  public async getKillerOfferings(): Promise<KillerOffering[]> {
    return this.dbdModelService.getKillerOfferings();
  }
}

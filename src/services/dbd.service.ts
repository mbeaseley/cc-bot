import { DBDModelService } from '../models/dbd-model.service';

export class DBDService {
  private dbdModelService: DBDModelService;

  constructor() {
    this.dbdModelService = new DBDModelService();
  }

  /**
   * Fetch Killers
   */
  public async getKillers(): Promise<void> {
    const response = await this.dbdModelService.getKillers();
    console.log(response);
  }

  /**
   * Fetch Killer Perks
   */
  public async getKillerPerks(): Promise<void> {
    const response = await this.dbdModelService.getKillerPerks();
    console.log(response);
  }

  /**
   * Fetch Killer Offerings
   */
  public async getKillerOfferings(): Promise<void> {
    const response = await this.dbdModelService.getKillerOfferings();
    console.log(response);
  }
}

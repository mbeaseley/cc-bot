import { InsultsModelService } from 'Models/insults-model.service';

export class InsultsService {
  private insultsModelService: InsultsModelService;

  constructor() {
    this.insultsModelService = new InsultsModelService();
  }

  /**
   * Fetch insult
   * @returns Promise<string>
   */
  public async getInsult(): Promise<string> {
    return this.insultsModelService.getInsult();
  }
}

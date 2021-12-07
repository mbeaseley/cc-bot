import { InsultModelService } from 'Models/insult-model.service';

export class InsultService {
  private insultModelService: InsultModelService;

  constructor() {
    this.insultModelService = new InsultModelService();
  }

  /**
   * Fetch insult
   * @returns Promise<string>
   */
  public async getInsult(): Promise<string> {
    return this.insultModelService.getInsult();
  }
}

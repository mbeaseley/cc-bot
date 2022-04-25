import { insultModelService } from 'Models/insult-model.service';

export class InsultService {
  /**
   * Fetch insult
   * @returns Promise<string>
   */
  public async getInsult(): Promise<string> {
    return insultModelService.getInsult();
  }
}

export const insultService = new InsultService();

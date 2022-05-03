import { insultModelService } from 'Models/insult-model.service';

class InsultService {
  /**
   * Fetch insult
   * @returns Promise<string>
   */
  public async getInsult(): Promise<string> {
    return insultModelService.getInsult();
  }
}

export const insultService = new InsultService();

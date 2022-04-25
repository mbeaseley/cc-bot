import { complimentModelService } from 'Models/compliment-model.service';
import { ComplimentObject } from 'Types/compliment';

export class ComplimentService {
  /**
   * Fetch Compliment
   * @returns Promise<ComplimentObject>
   */
  public async getCompliment(): Promise<ComplimentObject> {
    return complimentModelService.getCompliment();
  }
}

export const complimentService = new ComplimentService();

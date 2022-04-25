import { ComplimentModelService } from 'Models/compliment-model.service';
import { ComplimentObject } from 'Types/compliment';

export class ComplimentService {
  private complimentModelService: ComplimentModelService;

  constructor() {
    this.complimentModelService = new ComplimentModelService();
  }

  /**
   * Fetch Compliment
   * @returns Promise<ComplimentObject>
   */
  public async getCompliment(): Promise<ComplimentObject> {
    return this.complimentModelService.getCompliment();
  }
}

export const complimentService = new ComplimentService();

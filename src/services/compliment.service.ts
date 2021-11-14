import { ComplimentModelService } from '../models/compliment-model.service';
import { ComplimentObject } from '../types/compliment';

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

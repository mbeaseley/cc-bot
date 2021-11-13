import { AdviceModelService } from '../models/advice-model.service';
import { AdviceItem } from '../types/advice';

export class AdviceService {
  private adviceModelService: AdviceModelService;

  constructor() {
    this.adviceModelService = new AdviceModelService();
  }

  /**
   * Get single advice
   * @returns Promise<AdviceItem>
   */
  public async getAdvice(): Promise<AdviceItem> {
    return this.adviceModelService.getAdvice();
  }
}

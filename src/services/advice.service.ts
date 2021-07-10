import { AdviceModelService } from 'Models/advice-model.service';
import { AdviceItem } from 'Types/advice';

export class AdviceService {
  private adviceModelService: AdviceModelService;

  constructor() {
    this.adviceModelService = new AdviceModelService();
  }

  /**
   * Get single advice
   * @returns Promise<AdviceItem>
   */
  public async getAdvice(): Promise<AdviceItem | undefined> {
    return this.adviceModelService.getAdvice();
  }
}

import { adviceModelService } from 'Models/advice-model.service';
import { AdviceItem } from 'Types/advice';

class AdviceService {
  /**
   * Get single advice
   * @returns Promise<AdviceItem>
   */
  public async getAdvice(): Promise<AdviceItem> {
    return adviceModelService.getAdvice();
  }
}

export const adviceService = new AdviceService();

import { MemeModelService } from 'Models/meme-model.service';
import { MemeItem } from 'Types/meme';

export class MemeService {
  private memeModelService: MemeModelService;

  constructor() {
    this.memeModelService = new MemeModelService();
  }

  /**
   * Fetch meme
   * @returns Promise<MemeItem>
   */
  public async getMeme(): Promise<MemeItem> {
    return this.memeModelService.getMeme();
  }
}

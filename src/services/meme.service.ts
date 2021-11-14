import { MemeModelService } from '../models/meme-model.service';
import { MemeItem } from '../types/meme';

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

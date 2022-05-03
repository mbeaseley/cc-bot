import { memeModelService } from 'Models/meme-model.service';
import { MemeItem } from 'Types/meme';

class MemeService {
  /**
   * Fetch meme
   * @returns Promise<MemeItem>
   */
  public async getMeme(): Promise<MemeItem> {
    return memeModelService.getMeme();
  }
}

export const memeService = new MemeService();

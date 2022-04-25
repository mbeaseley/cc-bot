import { instagramModelService } from 'Models/instagram-model.service';
import { InstaUser } from 'Types/instagram';

export class InstagramService {
  /**
   * Get InstaUser
   * @param username
   * @returns Promise<InstaUser>
   */
  public async getInstaUser(username: string): Promise<InstaUser> {
    return instagramModelService.getInstaUser(username);
  }
}

export const instagramService = new InstagramService();

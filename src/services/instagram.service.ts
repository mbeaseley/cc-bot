import { InstagramModelService } from 'Models/instagram-model.service';
import { InstaUser } from 'Types/instagram';

export class InstagramService {
  private instagramModelService: InstagramModelService;

  constructor() {
    this.instagramModelService = new InstagramModelService('');
  }

  /**
   * Get InstaUser
   * @param username
   * @returns Promise<InstaUser>
   */
  public async getInstaUser(username: string): Promise<InstaUser> {
    return this.instagramModelService.getInstaUser(username);
  }
}

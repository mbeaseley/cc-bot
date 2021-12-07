import { HttpClient } from 'Interceptor/http-client';
import { ApiInstaUserResponse, InstaUser } from 'Types/instagram';
import { AxiosResponse } from 'axios';

export class InstagramModelService extends HttpClient {
  /**
   * Format response into correct type
   * @param res
   * @returns InstaUser
   */
  private fromPayload(res: ApiInstaUserResponse): InstaUser {
    const r = res?.graphql?.user;
    const u = new InstaUser();
    if (r.username) {
      u.username = r.username;
      u.biography = r.biography;
      u.fullName = r.full_name;
      u.profileImage = r.profile_pic_url;
      u.posts = r.edge_owner_to_timeline_media.count;
      u.followers = r.edge_followed_by.count;
      u.following = r.edge_follow.count;
      u.private = r.is_private;
      u.verified = r.is_verified;
    }
    return u;
  }

  /**
   * Get Insta User Response
   * @param username
   * @returns Promise<ApiInstaUserResponse>
   */
  private getResponse = (username: string): Promise<AxiosResponse<ApiInstaUserResponse>> =>
    this.instance.get<ApiInstaUserResponse>(`https://www.instagram.com/${username}/feed/?__a=1`, {
      headers: {
        Accept: 'application/json'
      }
    });

  /**
   * Get Insta User
   * @param username
   */
  public async getInstaUser(username: string): Promise<InstaUser> {
    const { data } = await this.getResponse(username);
    return this.fromPayload(data);
  }
}

import { HttpClient } from 'Interceptor/http-client';
import { MemeItem } from 'Types/meme';
import { AxiosResponse } from 'axios';

class MemeModelService extends HttpClient {
  constructor() {
    super('https://some-random-api.ml/');
  }

  /**
   * Fetch Meme
   * @returns Promise<AxiosResponse<MemeItem>>
   */
  private getResponse = (): Promise<AxiosResponse<MemeItem>> =>
    this.instance.get('meme', {
      headers: {
        Accept: 'application/json'
      }
    });

  /**
   * Get formatted response
   * @returns Promise<MemeItem>
   */
  public async getMeme(): Promise<MemeItem> {
    return (await this.getResponse())?.data ?? new MemeItem();
  }
}

export const memeModelService = new MemeModelService();

import { HttpClient } from 'Interceptor/httpClient';
import { MemeItem } from 'Types/meme';
import { AxiosResponse } from 'axios';

export class MemeModelService extends HttpClient {
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
        Accept: 'application/json',
      },
    });

  /**
   * Get formatted response
   * @returns Promise<MemeItem>
   */
  public async getMeme(): Promise<MemeItem> {
    return this.getResponse();
  }
}
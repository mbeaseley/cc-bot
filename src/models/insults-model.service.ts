import { HttpClient } from 'Interceptor/httpClient';
import { AxiosResponse } from 'axios';

export class InsultsModelService extends HttpClient {
  constructor() {
    super('https://insult.mattbas.org/api');
  }

  /**
   * Fetch Insult
   * @returns Promise<AxiosResponse<ComplimentObject>>
   */
  private getResponse = (): Promise<AxiosResponse<string>> =>
    this.instance.get('insult', {
      headers: {
        Accept: 'application/json',
      },
    });

  /**
   * Gets formatted response
   * @returns Promise<string>
   */
  public async getInsult(): Promise<string> {
    return this.getResponse();
  }
}

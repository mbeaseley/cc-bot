import { HttpClient } from 'Interceptor/http-client';
import { AxiosResponse } from 'axios';

class InsultModelService extends HttpClient {
  constructor() {
    super('https://insult.mattbas.org/api');
  }

  /**
   * Fetch Insult
   * @returns Promise<AxiosResponse<string>>
   */
  private getResponse = (): Promise<AxiosResponse<string>> =>
    this.instance.get('insult', {
      headers: {
        Accept: 'application/json'
      }
    });

  /**
   * Gets formatted response
   * @returns Promise<string>
   */
  public async getInsult(): Promise<string> {
    return (await this.getResponse())?.data;
  }
}

export const insultModelService = new InsultModelService();

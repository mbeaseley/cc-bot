import { HttpClient } from 'Interceptor/http-client';
import { ComplimentObject } from 'Types/compliment';
import { AxiosResponse } from 'axios';

class ComplimentModelService extends HttpClient {
  constructor() {
    super('');
  }

  /**
   * Fetch Compliment
   * @returns Promise<AxiosResponse<ComplimentObject>>
   */
  private getResponse = (): Promise<AxiosResponse<ComplimentObject>> =>
    this.instance.get('https://complimentr.com/api', {
      headers: {
        Accept: 'application/json'
      }
    });

  /**
   * Gets formatted response
   * @returns Promise<ComplimentObject>
   */
  public async getCompliment(): Promise<ComplimentObject> {
    return (await this.getResponse())?.data ?? new ComplimentObject();
  }
}

export const complimentModelService = new ComplimentModelService();

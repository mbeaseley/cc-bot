import { AxiosResponse } from 'axios';
import { HttpClient } from 'Interceptor/http-client';
import { AdviceItem, ApiAdviceResponse } from 'Types/advice';

export class AdviceModelService extends HttpClient {
  constructor() {
    super('');
  }

  /**
   * Format into correct type
   * @param res
   * @returns AdviceItem
   */
  private fromPayload(data: ApiAdviceResponse): AdviceItem {
    const { slip } = data;
    return new AdviceItem(slip.id, slip.advice);
  }

  /**
   * Fetch advice
   * @returns Promise<AxiosResponse<ApiAdviceResponse>>
   */
  private getResponse = (): Promise<AxiosResponse<ApiAdviceResponse>> =>
    this.instance.get('https://api.adviceslip.com/advice', {
      headers: {
        Accept: 'application/json'
      }
    });

  /**
   * Get single advice
   * @returns Promise<AdviceItem>
   */
  public async getAdvice(): Promise<AdviceItem> {
    const { data } = await this.getResponse();
    return this.fromPayload(data);
  }
}

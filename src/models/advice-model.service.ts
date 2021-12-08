import { HttpClient } from 'Interceptor/http-client';
import { AdviceItem, ApiAdviceResponse } from 'Types/advice';
import { AxiosResponse } from 'axios';

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
    const slip = data?.slip;
    return new AdviceItem(slip?.id, slip?.advice);
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

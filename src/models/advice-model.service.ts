import { HttpClient } from 'Interceptor/httpClient';
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
  private fromPayload(res: ApiAdviceResponse): AdviceItem | undefined {
    const slip = res.slip;
    if (slip) {
      return new AdviceItem(slip.id, slip.advice);
    } else {
      return undefined;
    }
  }

  /**
   * Fetch advice
   * @returns Promise<AxiosResponse<ApiAdviceResponse>>
   */
  private getResponse = (): Promise<AxiosResponse<ApiAdviceResponse>> =>
    this.instance.get('https://api.adviceslip.com/advice', {
      headers: {
        Accept: 'application/json',
      },
    });

  /**
   * Get single advice
   * @returns Promise<AdviceItem | undefined>
   */
  public async getAdvice(): Promise<AdviceItem | undefined> {
    const res = await this.getResponse();
    return this.fromPayload(res);
  }
}

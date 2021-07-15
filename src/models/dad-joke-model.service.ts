import { HttpClient } from 'Interceptor/httpClient';
import { JokeResponse } from 'Types/dadJoke';
import { AxiosResponse } from 'axios';

export class DadJokeModelService extends HttpClient {
  constructor() {
    super('');
  }

  /**
   * Fetch Joke
   * @returns Promise<AxiosResponse<JokeResponse>>
   */
  private getResponse = (): Promise<AxiosResponse<JokeResponse>> =>
    this.instance.get('https://icanhazdadjoke.com/', {
      headers: {
        Accept: 'application/json',
      },
    });

  /**
   * Get formatted response
   * @returns Promise<JokeResponse>
   */
  public async getJoke(): Promise<JokeResponse> {
    return this.getResponse();
  }
}

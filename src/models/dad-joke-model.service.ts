import { HttpClient } from 'Interceptor/http-client';
import { ApiJokeResponse } from 'Types/api/dad-joke';
import { Joke } from 'Types/dad-joke';
import { AxiosResponse } from 'axios';

class DadJokeModelService extends HttpClient {
  constructor() {
    super('');
  }

  /**
   * Format into correct type
   * @param res
   * @returns AdviceItem
   */
  private fromPayload(res: ApiJokeResponse): Joke {
    return new Joke(res?.id, res.setup ?? res.joke ?? '', res?.delivery);
  }

  /**
   * Fetch Joke
   * @returns Promise<AxiosResponse<JokeResponse>>
   */
  private getResponse = (): Promise<AxiosResponse<ApiJokeResponse>> =>
    this.instance.get('https://v2.jokeapi.dev/joke/Miscellaneous,Pun,Spooky,Christmas', {
      headers: {
        Accept: 'application/json'
      }
    });

  /**
   * Get formatted response
   * @returns Promise<JokeResponse>
   */
  public async getJoke(): Promise<Joke> {
    const { data } = await this.getResponse();
    return this.fromPayload(data);
  }
}

export const dadJokeModelService = new DadJokeModelService();

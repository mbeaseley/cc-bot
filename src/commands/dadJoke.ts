import { HttpClient } from '../interceptor/HttpClient';

interface JokeResponse {
  id: string;
  joke: string;
  status: string;
}

export class DadJoke extends HttpClient {
  constructor() {
    super('https://icanhazdadjoke.com/');
  }

  /**
   * Get random joke
   */
  private getRandomJoke = () =>
    this.instance.get<JokeResponse>('', {
      headers: {
        Accept: 'application/json',
      },
    });

  /**
   * Init
   */
  public async init(): Promise<string> {
    const res = await this.getRandomJoke();
    return res.joke;
  }
}

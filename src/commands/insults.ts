import { HttpClient } from '../interceptor/HttpClient';

export class Insult extends HttpClient {
  constructor() {
    super('https://insult.mattbas.org/api/insult');
  }

  /**
   * Get random joke
   */
  private getRandomInsult = () =>
    this.instance.get<string>('', {
      headers: {
        Accept: 'application/json',
      },
    });

  /**
   * Init
   */
  public async init(): Promise<string> {
    const insult = await this.getRandomInsult();
    console.log(insult);
    return insult;
  }
}

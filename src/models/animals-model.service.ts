import { HttpClient } from 'Interceptor/httpClient';
import { Animal } from 'Types/animal';
import { AxiosResponse } from 'axios';

export class AnimalsModelService extends HttpClient {
  constructor() {
    super('https://some-random-api.ml/img/');
  }

  /**
   * Get response
   * @param link
   * @returns Promise<AxiosResponse<Animal>>
   */
  private getResponse = (link: string): Promise<AxiosResponse<Animal>> =>
    this.instance.get(link, {
      headers: {
        Accept: 'application/json',
      },
    });

  /**
   * Fetch cat
   * @returns Promise<Animal>
   */
  public async getCat(): Promise<Animal> {
    return this.getResponse('cat');
  }

  /**
   * Fetch dog
   * @returns Promise<Animal>
   */
  public async getDog(): Promise<Animal> {
    return this.getResponse('dog');
  }
}

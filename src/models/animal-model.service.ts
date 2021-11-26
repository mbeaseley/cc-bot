import { HttpClient } from '../interceptor/http-client';
import { Animal, AnimalKind, AnimalKind } from '../types/animal';
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
  private getResponse = (link: AnimalKind): Promise<AxiosResponse<Animal>> =>
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

  /**
   * Fetch panda
   * @returns Promise<Animal>
   */
  public async getPanda(): Promise<Animal> {
    return this.getResponse('panda');
  }

  /**
   * Fetch red panda
   * @returns Promise<Animal>
   */
  public async getRedPanda(): Promise<Animal> {
    return this.getResponse('red_panda');
  }

  /**
   * Fetch bird
   * @returns Promise<Animal>
   */
  public async getBird(): Promise<Animal> {
    return this.getResponse('birb');
  }

  /**
   * Fetch fox
   * @returns Promise<Animal>
   */
  public async getFox(): Promise<Animal> {
    return this.getResponse('fox');
  }

  /**
   * Fetch koala
   * @returns Promise<Animal>
   */
  public async getKoala(): Promise<Animal> {
    return this.getResponse('koala');
  }
}

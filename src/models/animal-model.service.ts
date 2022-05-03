import { HttpClient } from 'Interceptor/http-client';
import { Animal, AnimalKind } from 'Types/animal';
import { AxiosResponse } from 'axios';

class AnimalsModelService extends HttpClient {
  constructor() {
    super('https://some-random-api.ml/img/');
  }

  private fromPayload(res: AxiosResponse<Animal, any>): Animal {
    return new Animal(res.data.link);
  }

  /**
   * Get response
   * @param link
   * @returns Promise<AxiosResponse<Animal>>
   */
  private getResponse = (link: AnimalKind): Promise<AxiosResponse<Animal, any>> =>
    this.instance.get(link ?? '', {
      headers: {
        Accept: 'application/json'
      }
    });

  /**
   * Fetch cat
   * @returns Promise<Animal>
   */
  public async getCat(): Promise<Animal> {
    return (await this.getResponse('cat'))?.data;
  }

  /**
   * Fetch dog
   * @returns Promise<Animal>
   */
  public async getDog(): Promise<Animal> {
    return (await this.getResponse('dog'))?.data;
  }

  /**
   * Fetch panda
   * @returns Promise<Animal>
   */
  public async getPanda(): Promise<Animal> {
    return (await this.getResponse('panda'))?.data;
  }

  /**
   * Fetch red panda
   * @returns Promise<Animal>
   */
  public async getRedPanda(): Promise<Animal> {
    return (await this.getResponse('red_panda'))?.data;
  }

  /**
   * Fetch bird
   * @returns Promise<Animal>
   */
  public async getBird(): Promise<Animal> {
    return (await this.getResponse('birb'))?.data;
  }

  /**
   * Fetch fox
   * @returns Promise<Animal>
   */
  public async getFox(): Promise<Animal> {
    return (await this.getResponse('fox'))?.data;
  }

  /**
   * Fetch koala
   * @returns Promise<Animal>
   */
  public async getKoala(): Promise<Animal> {
    return (await this.getResponse('koala'))?.data;
  }
}

export const animalsModelService = new AnimalsModelService();

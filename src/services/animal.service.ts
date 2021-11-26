import { AnimalsModelService } from '../models/animal-model.service';
import { Animal } from '../types/animal';

export class AnimalsService {
  private animalsModelService: AnimalsModelService;

  constructor() {
    this.animalsModelService = new AnimalsModelService();
  }

  /**
   * Fetch cat
   * @returns Promise<Animal>
   */
  public async getCat(): Promise<Animal> {
    return this.animalsModelService.getCat();
  }

  /**
   * Fetch dog
   * @returns Promise<Animal>
   */
  public async getDog(): Promise<Animal> {
    return this.animalsModelService.getDog();
  }

  /**
   * Fetch panda
   * @returns Promise<Animal>
   */
  public async getPanda(): Promise<Animal> {
    return this.animalsModelService.getPanda();
  }

  /**
   * Fetch red panda
   * @returns Promise<Animal>
   */
  public async getRedPanda(): Promise<Animal> {
    return this.animalsModelService.getRedPanda();
  }

  /**
   * Fetch bird
   * @returns Promise<Animal>
   */
  public async getBird(): Promise<Animal> {
    return this.animalsModelService.getBird();
  }

  /**
   * Fetch fox
   * @returns Promise<Animal>
   */
  public async getFox(): Promise<Animal> {
    return this.animalsModelService.getFox();
  }

  /**
   * Fetch koala
   * @returns Promise<Animal>
   */
  public async getKoala(): Promise<Animal> {
    return this.animalsModelService.getKoala();
  }
}

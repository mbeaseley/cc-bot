import { AnimalsModelService } from 'Models/animals-model.service';
import { Animal } from 'Types/animal';

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
}
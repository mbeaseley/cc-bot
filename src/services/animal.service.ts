import { animalsModelService } from 'Models/animal-model.service';
import { Animal } from 'Types/animal';

class AnimalsService {
  /**
   * Fetch cat
   * @returns Promise<Animal>
   */
  public async getCat(): Promise<Animal> {
    return animalsModelService.getCat();
  }

  /**
   * Fetch dog
   * @returns Promise<Animal>
   */
  public async getDog(): Promise<Animal> {
    return animalsModelService.getDog();
  }

  /**
   * Fetch panda
   * @returns Promise<Animal>
   */
  public async getPanda(): Promise<Animal> {
    return animalsModelService.getPanda();
  }

  /**
   * Fetch red panda
   * @returns Promise<Animal>
   */
  public async getRedPanda(): Promise<Animal> {
    return animalsModelService.getRedPanda();
  }

  /**
   * Fetch bird
   * @returns Promise<Animal>
   */
  public async getBird(): Promise<Animal> {
    return animalsModelService.getBird();
  }

  /**
   * Fetch fox
   * @returns Promise<Animal>
   */
  public async getFox(): Promise<Animal> {
    return animalsModelService.getFox();
  }

  /**
   * Fetch koala
   * @returns Promise<Animal>
   */
  public async getKoala(): Promise<Animal> {
    return animalsModelService.getKoala();
  }
}

export const animalsService = new AnimalsService();

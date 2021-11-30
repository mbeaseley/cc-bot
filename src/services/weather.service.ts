import { WeatherModelService } from 'Models/weather-model.service';
import { WeatherObject } from 'Types/weather';

export class WeatherService {
  private weatherModelService: WeatherModelService;

  constructor() {
    this.weatherModelService = new WeatherModelService('');
  }

  /**
   * Get Current Weather
   * @returns Promise<WeatherObject>
   */
  public async getCurrentWeather(location: string): Promise<WeatherObject> {
    return this.weatherModelService.getCurrentWeather(location);
  }
}

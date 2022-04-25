import { weatherModelService } from 'Models/weather-model.service';
import { WeatherObject } from 'Types/weather';

export class WeatherService {
  /**
   * Get Current Weather
   * @returns Promise<WeatherObject>
   */
  public async getCurrentWeather(location: string): Promise<WeatherObject> {
    return weatherModelService.getCurrentWeather(location);
  }
}

export const weatherService = new WeatherService();

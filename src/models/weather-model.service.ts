import { HttpClient } from '../interceptor/httpClient';
import { AxiosResponse } from 'axios';
import { environment } from '../utils/environment';
import {
  WeatherObject,
  ApiResponseObject,
  WeatherItem,
} from '../types/weather';
import dayjs = require('dayjs');

export class WeatherModelService extends HttpClient {
  /**
   * Current Weather Payload
   * @param res
   * @returns WeatherObject
   */
  private fromPayload(res: ApiResponseObject): WeatherObject {
    const w = new WeatherObject();
    w.id = res.id;
    w.coord = {
      lon: res.coord?.lon,
      lat: res.coord?.lat,
    };
    const weather = res.weather[0];
    const weatherItem = new WeatherItem(
      weather.id,
      weather.main,
      weather.description,
      weather.icon
    );
    w.weather = weatherItem;
    w.base = res.base;
    w.weatherDetails = {
      temp: res.main?.temp,
      feelingTempLike: res.main?.feels_like,
      tempMin: res.main?.temp_min,
      tempMax: res.main?.temp_max,
      pressure: res.main?.pressure,
      humidity: res.main?.humidity,
    };
    w.visibility = res.visibility;
    w.wind = {
      speed: res.wind?.speed,
      degree: res.wind?.deg,
      gust: res.wind?.gust,
    };
    w.clouds = {
      all: res.clouds?.all,
    };

    if (res.rain) {
      w.rains = {
        oneHour: res.rain['1hr'],
        threeHour: res.rain['3hr'],
      };
    }

    if (res.snow) {
      w.snow = {
        oneHour: res.snow['1hr'],
        threeHour: res.snow['3hr'],
      };
    }
    w.timeOfDate = dayjs(res.dt * 1e3);
    w.area = {
      type: res.sys?.type,
      id: res.sys?.id,
      country: res.sys?.country,
      sunrise: dayjs(res.sys?.sunrise * 1e3),
      sunset: dayjs(res.sys?.sunset * 1e3),
    };
    const plusMinus = res.timezone / 3600 > 0 ? '+' : '';
    w.timezone = `UTC${plusMinus}${res.timezone / 3600}`;
    w.id = res.id;
    w.name = res.name;
    return w;
  }

  /**
   * Get Current Weather Response
   * @returns ApiResponseObject
   */
  private getCurrentWeatherResponse = (
    location: string
  ): Promise<AxiosResponse<ApiResponseObject>> =>
    this.instance.get<ApiResponseObject>(
      'https://api.openweathermap.org/data/2.5/weather',
      {
        headers: {
          Accept: 'application/json',
        },
        params: {
          appid: environment.weatherAppId,
          q: location,
          units: 'metric',
        },
      }
    );

  /**
   * Get Current Weather
   * @returns Promise WeatherObject
   */
  public async getCurrentWeather(location: string): Promise<WeatherObject> {
    const res = await this.getCurrentWeatherResponse(location);
    return this.fromPayload(res);
  }
}

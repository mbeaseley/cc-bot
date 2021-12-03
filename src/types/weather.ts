import dayjs = require('dayjs');

/**=============================
  FORMATTED WEATHER OBJECT
===============================*/
export class WeatherObject {
  id: number | undefined;
  coord: Coordinates | undefined;
  weather: WeatherItem | undefined;
  base: string | undefined;
  weatherDetails: WeatherDetails | undefined;
  visibility: number | undefined;
  wind: WindDetails | undefined;
  clouds: CloudDetails | undefined;
  rains: RateDetails | undefined;
  snow: RateDetails | undefined;
  timeOfDate: dayjs.Dayjs | undefined;
  area: AreaDetails | undefined;
  timezone: string | undefined;
  name: string | undefined;
}

export interface Coordinates {
  lon: number;
  lat: number;
}

export class WeatherItem {
  id: number;
  main: string;
  description: string;
  icon: string;

  constructor(id: number, main: string, description: string, icon: string) {
    this.id = id;
    this.main = main;
    this.description = description;
    this.icon = icon;
  }
}

export interface WeatherDetails {
  temp: number;
  feelingTempLike: number;
  tempMin: number;
  tempMax: number;
  pressure: number;
  humidity: number;
}

export interface WindDetails {
  speed: number;
  degree: number;
  gust: number;
}

export interface CloudDetails {
  all: number; // cloudiness %
}

export interface RateDetails {
  oneHour: number;
  threeHour: number;
}

export interface AreaDetails {
  type: number;
  id: number;
  country: string;
  sunrise: dayjs.Dayjs;
  sunset: dayjs.Dayjs;
}

export interface WindDirection {
  name: string;
  min: number;
  max: number;
}

/**=============================
  API RESPONSE OBJECT
===============================*/
export interface ApiResponseObject {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  clouds: {
    all: number;
  };
  rain: {
    ['1hr']: number;
    ['3hr']: number;
  };
  snow: {
    ['1hr']: number;
    ['3hr']: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
}

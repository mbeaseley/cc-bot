import { Command, CommandMessage, Description } from '@typeit/discord';
import { environment } from '../utils/environment';
import { ClientUser, Message, MessageEmbed } from 'discord.js';
import { WeatherObject } from '../types/weather';
import { WeatherService } from '../services/weather.service';
import Utility from '../utils/utility';

export class Weather {
  private weatherService: WeatherService;

  constructor() {
    this.weatherService = new WeatherService();
  }

  /**
   * Convert wind direction in degree into words
   * @param windDegree
   * @returns string
   */
  private getWindDirection(windDegree: number | undefined): string {
    if (!windDegree) {
      return '';
    }

    if (windDegree >= 11.25 && windDegree <= 33.74) {
      return 'North Northeast';
    }

    if (windDegree >= 33.75 && windDegree <= 56.24) {
      return 'Northeast';
    }

    if (windDegree >= 56.25 && windDegree <= 78.74) {
      return 'East Northeast';
    }

    if (windDegree >= 78.75 && windDegree <= 101.24) {
      return 'East';
    }

    if (windDegree >= 101.25 && windDegree <= 123.74) {
      return 'East Southeast';
    }

    if (windDegree >= 123.75 && windDegree <= 146.24) {
      return 'Southeast';
    }

    if (windDegree >= 146.25 && windDegree <= 168.74) {
      return 'South Southeast';
    }

    if (windDegree >= 168.75 && windDegree <= 191.24) {
      return 'South';
    }

    if (windDegree >= 191.25 && windDegree <= 213.74) {
      return 'South SouthWest';
    }

    if (windDegree >= 213.75 && windDegree <= 236.24) {
      return 'SouthWest';
    }

    if (windDegree >= 236.25 && windDegree <= 258.74) {
      return 'West SouthWest';
    }

    if (windDegree >= 258.75 && windDegree <= 281.24) {
      return 'West';
    }

    if (windDegree >= 281.25 && windDegree <= 303.74) {
      return 'West Northwest';
    }

    if (windDegree >= 303.75 && windDegree <= 326.24) {
      return 'Northwest';
    }

    if (windDegree >= 326.25 && windDegree <= 348.74) {
      return 'Northwest';
    }

    return 'North';
  }

  /**
   * Create Embed Message
   * @param w - weather
   * @param user
   * @returns MessageEmbed
   */
  private createMessage = (
    w: WeatherObject,
    user: ClientUser | null
  ): MessageEmbed => {
    return new MessageEmbed()
      .setAuthor(
        `Weather Forecast for ${w.name}, ${w.area?.country}`,
        user?.displayAvatarURL()
      )
      .setColor(5602003)
      .setThumbnail(
        `http://openweathermap.org/img/wn/${w.weather?.icon}@2x.png`
      )
      .setDescription(
        `**${Utility.captaliseFirstLetter(w.weather?.description ?? '')}**`
      )
      .addFields([
        {
          name: 'Timezone',
          value: `${w.timezone}`,
          inline: true,
        },
        {
          name: 'Degree Type',
          value: 'Celsius',
          inline: true,
        },
        {
          name: 'Temperature',
          value: w.weatherDetails
            ? `${Math.round(w.weatherDetails.temp)}°`
            : 'Unknown',
          inline: true,
        },
        {
          name: 'Wind',
          value: `${w.wind?.speed} m/s ${this.getWindDirection(
            w.wind?.degree
          )}`,
          inline: true,
        },
        {
          name: 'Feel like',
          value: w.weatherDetails
            ? `${Math.round(w.weatherDetails.feelingTempLike)}°`
            : 'Unknown',
          inline: true,
        },
        {
          name: 'Humidity',
          value: `${w.weatherDetails?.humidity}%`,
          inline: true,
        },
      ]);
  };

  /**
   * Get weather for location and responds with message to channel
   * @param command
   */
  private async getResponse(command: CommandMessage): Promise<Message | void> {
    const commandArray = command.content.split(' ');
    commandArray.splice(0, 2).join(' ');
    const location = commandArray.join(' ');

    const weather = await this.weatherService.getCurrentWeather(location);
    const message = this.createMessage(weather, command.client.user);

    return command.channel.send(message);
  }

  /**
   * Weather Init
   * @param command
   */
  @Command('weather')
  @Description('Get the weather of your area')
  init(command: CommandMessage): Promise<Message | void> {
    return this.getResponse(command).catch(() => {
      command.reply(environment.error);
    });
  }
}

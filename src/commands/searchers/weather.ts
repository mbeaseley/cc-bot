import { Command, CommandMessage, Description } from '@typeit/discord';
import { windDirections } from 'Data/weather';
import { Logger } from 'Services/logger.service';
import { WeatherService } from 'Services/weather.service';
import { WeatherObject } from 'Types/weather';
import Utility from 'Utils/utility';
import { ClientUser, Message, MessageEmbed } from 'discord.js';

export class Weather {
  private logger: Logger;
  private weatherService: WeatherService;

  constructor() {
    this.weatherService = new WeatherService();
    this.logger = new Logger();
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

    return (
      windDirections.find((w) => windDegree >= w.min && windDegree <= w.max)
        ?.name ?? 'North'
    );
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
   * Weather Init
   * @param command
   */
  @Command('weather')
  @Description('Get the weather of your area')
  async init(command: CommandMessage): Promise<Message | void> {
    try {
      if (command.deletable) await command.delete();

      const msg = command.channel.send('**:hourglass: Fetching weather...**');

      const location = Utility.getOptionFromCommand(
        command.content,
        2,
        ' '
      ) as string;

      if (!location) {
        await (await msg).delete();
        return command.channel
          .send(`**Please add location to query**`)
          .then((m) => m.delete({ timeout: 5000 }));
      } else {
        const weather = await this.weatherService.getCurrentWeather(location);
        await (await msg).delete();

        const message = this.createMessage(weather, command.client.user);
        return command.channel.send(message);
      }
    } catch (e: unknown) {
      if (command.deletable) await command.delete();
      this.logger.error(
        `Command: 'weather' has error: ${(e as Error).message}.`
      );
      return command.channel
        .send(
          `An error has occured. If this error keeps occurring, please contact support.`
        )
        .then((m) => m.delete({ timeout: 5000 }));
    }
  }
}

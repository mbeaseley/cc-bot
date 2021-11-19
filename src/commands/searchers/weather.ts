import { ClientUser, CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { windDirections } from '../../data/weather';
import { WeatherService } from '../../services/weather.service';
import { WeatherObject } from '../../types/weather';
import Translate from '../../utils/translate';
import Utility from '../../utils/utility';

@Discord()
export abstract class Weather {
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
        Translate.find('weatherAuthor', w.name || '', w.area?.country || ''),
        user?.displayAvatarURL()
      )
      .setColor(5602003)
      .setThumbnail(Translate.find('weatherUrl', w.weather?.icon as string))
      .setDescription(
        `**${Utility.captaliseFirstLetter(w.weather?.description ?? '')}**`
      )
      .addFields([
        {
          name: Translate.find('weatherTimezone'),
          value: `${w.timezone}`,
          inline: true,
        },
        {
          name: Translate.find('weatherDegree'),
          value: 'Celsius',
          inline: true,
        },
        {
          name: Translate.find('weatherTemp'),
          value: w.weatherDetails
            ? `${Math.round(w.weatherDetails.temp)}°`
            : 'Unknown',
          inline: true,
        },
        {
          name: Translate.find('weatherWind'),
          value: `${w.wind?.speed} m/s ${this.getWindDirection(
            w.wind?.degree
          )}`,
          inline: true,
        },
        {
          name: Translate.find('weatherFeelLike'),
          value: w.weatherDetails
            ? `${Math.round(w.weatherDetails.feelingTempLike)}°`
            : 'Unknown',
          inline: true,
        },
        {
          name: Translate.find('weatherHumidity'),
          value: `${w.weatherDetails?.humidity}%`,
          inline: true,
        },
      ]);
  };

  @Slash('weather', { description: 'Get today weather' })
  async init(
    @SlashOption('location', {
      description: 'Enter a major city?',
      required: true,
    })
    location: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const weather = await this.weatherService.getCurrentWeather(location);

    if (!weather) {
      await interaction.reply(Translate.find('weatherNoLocation'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const msg = this.createMessage(weather, interaction.client.user);
    return interaction.reply({ embeds: [msg] });
  }
}

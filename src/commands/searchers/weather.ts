import { windDirections } from 'Data/weather';
import { weatherService } from 'Services/weather.service';
import { WeatherObject } from 'Types/weather';
import { Command } from 'Utils/command';
import { ClientUser, CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';

@Discord()
export abstract class Weather extends Command {
  constructor() {
    super();
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

    return windDirections.find((w) => windDegree >= w.min && windDegree <= w.max)?.name ?? 'North';
  }

  /**
   * Create Embed Message
   * @param w - weather
   * @param user
   * @returns MessageEmbed
   */
  private createMessage = (w: WeatherObject, user: ClientUser | null): MessageEmbed => {
    return new MessageEmbed()
      .setAuthor({
        name: this.c('weatherAuthor', w.name || '', w.area?.country || ''),
        iconURL: user?.displayAvatarURL()
      })
      .setColor(5602003)
      .setThumbnail(this.c('weatherUrl', w.weather?.icon as string))
      .setDescription(this.cBold('weatherBold', w.weather?.description ?? ''))
      .addFields([
        {
          name: this.c('weatherTimezone'),
          value: `${w.timezone}`,
          inline: true
        },
        {
          name: this.c('weatherDegree'),
          value: this.c('weatherDegreeValue'),
          inline: true
        },
        {
          name: this.c('weatherTemp'),
          value: this.c(
            'weatherTempValue',
            w.weatherDetails ? Math.round(w.weatherDetails?.temp)?.toString() : '~'
          ),
          inline: true
        },
        {
          name: this.c('weatherWind'),
          value: this.c(
            'weatherWindValue',
            w.wind?.speed.toString() ?? '~',
            this.getWindDirection(w.wind?.degree) ?? '~'
          ),
          inline: true
        },
        {
          name: this.c('weatherFeelLike'),
          value: this.c(
            'weatherTempValue',
            w.weatherDetails ? Math.round(w.weatherDetails?.feelingTempLike)?.toString() : '~'
          ),
          inline: true
        },
        {
          name: this.c('weatherHumidity'),
          value: this.c('weatherPercent', w.weatherDetails?.humidity.toString() ?? '~'),
          inline: true
        }
      ]);
  };

  @Slash('weather', {
    description: 'Get today weather!'
  })
  async init(
    @SlashOption('location', {
      description: 'Enter a major city?'
    })
    location: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const weather = await weatherService.getCurrentWeather(location);

    if (!weather) {
      await interaction.reply(this.c('weatherNoLocation'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const msg = this.createMessage(weather, interaction.client.user);
    return interaction.reply({ embeds: [msg] });
  }
}

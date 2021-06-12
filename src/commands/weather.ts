import { Command, CommandMessage, Description } from '@typeit/discord';
import { environment } from '../utils/environment';
import { MessageEmbed } from 'discord.js';
import { WeatherObject } from '../types/weather';
import { WeatherService } from '../services/weather.service';

export class Weather {
  private weatherService: WeatherService;

  constructor() {
    this.weatherService = new WeatherService();
  }

  private createMessage = (
    command: CommandMessage,
    weather: WeatherObject
  ): MessageEmbed => {
    return new MessageEmbed();
  };

  private async getResponse(command: CommandMessage): Promise<void> {
    const commandArray = command.content.split(' ');
    commandArray.splice(0, 2).join(' ');
    const location = commandArray.join(' ');

    const weather = await this.weatherService
      .getCurrentWeather(location)
      .catch(console.log);

    console.log(weather);

    const message = this.createMessage(command, new WeatherObject());

    return Promise.resolve();
  }

  @Command('weather')
  @Description('Get the weather of your area')
  init(command: CommandMessage): Promise<void> {
    return this.getResponse(command).catch(() => {
      command.reply(environment.error);
    });
  }
}

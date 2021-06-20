import { Command, CommandMessage, Description } from '@typeit/discord';
import { MessageEmbed } from 'discord.js';
import { SteamService } from '../services/steam.service';
import { Logger } from '../services/logger.service';

export class Steam {
  private logger: Logger;
  private steamService: SteamService;

  constructor() {
    this.logger = new Logger();
    this.steamService = new SteamService();
  }

  @Command('steam')
  @Description('')
  async init(command: CommandMessage): Promise<any> {
    const commandArray = command.content.split(' ');
    commandArray.splice(0, 2);
    const vanityUrl = commandArray.join(' ');

    try {
      const user = await this.steamService.getVanityUser(vanityUrl);

      if (!user?.steamId) {
        return command.channel.send(
          '**This username was unable to be found.**'
        );
      }

      const playerSummary = await this.steamService.getPlayerSummary(
        user.steamId
      );
      console.log(playerSummary);
      await command.delete();
    } catch (e: any) {
      this.logger.error(`Command: 'steam' has error: ${e.message}.`);
    }
  }
}

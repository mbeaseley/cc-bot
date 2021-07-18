import { Command, CommandMessage, Description } from '@typeit/discord';
import { Logger } from 'Services/logger.service';
import { SteamService } from 'Services/steam.service';
import { PlayerSummary, UserBans } from 'Types/steam';
import Utility from 'Utils/utility';
import { Message, MessageEmbed } from 'discord.js';

export class Steam {
  private logger: Logger;
  private steamService: SteamService;

  constructor() {
    this.logger = new Logger();
    this.steamService = new SteamService();
  }

  /**
   * Create Embed Message
   * @param playerSummary
   * @param userBans
   * @returns MessageEmbed
   */
  private createMessage(
    playerSummary: PlayerSummary,
    userBans: UserBans
  ): MessageEmbed {
    return new MessageEmbed()
      .setColor(0x0099ff)
      .setAuthor(`Steam Services`, playerSummary?.avatarFull)
      .setTitle(playerSummary.name)
      .setURL(playerSummary?.profileUrl || '')
      .setThumbnail(playerSummary.avatarFull)
      .setDescription(
        `**Real Name:** ${playerSummary.realName || '~'}\n**Status:** ${
          playerSummary.nameState || '~'
        }\n**Location:** ${playerSummary.location?.cityName || '~'}, ${
          playerSummary.location?.countryCode
        }\n**Account Created:** ${
          playerSummary.timeCreated?.format('DD/MM/YYYY') || '~'
        }\n**Bans:** Vac: ${userBans.numberOfVACBans || '~'}, Game: ${
          userBans.numberOfGameBans || '~'
        }\n**Link:** [Link to profile](${playerSummary.profileUrl})`
      )
      .setTimestamp();
  }

  /**
   * Fetch and create message of steam user profile
   * @param command
   */
  @Command('steam')
  @Description('Check and share your profile with friends on steam')
  async init(command: CommandMessage): Promise<void | Message> {
    try {
      if (command.deletable) await command.delete();

      const msg = await Utility.sendMessage(
        command,
        '**:hourglass: Fetching account...**'
      );

      const vanityUrl = Utility.getOptionFromCommand(
        command.content,
        2,
        ' '
      ) as string;

      const user = await this.steamService.getVanityUser(vanityUrl);
      await msg.delete();

      if (!user?.steamId) {
        return Utility.sendMessage(
          command,
          '**This username was unable to be found.**',
          'channel',
          5000
        );
      }

      const playerSummary = await this.steamService.getPlayerSummary(
        user.steamId
      );
      const userBans = await this.steamService.getUserBans(user.steamId);
      const message = this.createMessage(playerSummary, userBans);

      if (command.deletable) await command.delete();
      return Utility.sendMessage(command, message);
    } catch (e: unknown) {
      if (command.deletable) await command.delete();
      this.logger.error(`Command: 'steam' has error: ${(e as Error).message}.`);
      return Utility.sendMessage(
        command,
        `The following error has occurred: ${
          (e as Error).message
        }. If this error keeps occurring, please contact support.`,
        'channel',
        5000
      );
    }
  }
}

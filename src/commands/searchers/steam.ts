import { Command, CommandMessage, Description } from '@typeit/discord';
import { Logger } from 'Services/logger.service';
import { SteamService } from 'Services/steam.service';
import { PlayerSummary, UserBans } from 'Types/steam';
import Translate from 'Utils/translate';
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
      .setAuthor(Translate.find('steamAuthor'), playerSummary?.avatarFull)
      .setTitle(playerSummary.name)
      .setURL(playerSummary?.profileUrl || '')
      .setThumbnail(playerSummary.avatarFull)
      .setDescription(
        Translate.find(
          'steamDes',
          playerSummary.realName || '~',
          playerSummary.nameState || '~',
          playerSummary.location?.cityName || '~',
          playerSummary.location?.countryCode || '~',
          playerSummary.timeCreated?.format('DD/MM/YYYY') || '~',
          userBans.numberOfVACBans.toString() || '~',
          userBans.numberOfGameBans.toString() || '~',
          playerSummary.profileUrl as string
        )
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
        Translate.find('steamFetch')
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
          Translate.find('steamNoUser'),
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
      this.logger.error(
        Translate.find('errorLog', 'steam', (e as Error).message)
      );
      return Utility.sendMessage(
        command,
        Translate.find('errorDefault', (e as Error).message),
        'channel',
        5000
      );
    }
  }
}

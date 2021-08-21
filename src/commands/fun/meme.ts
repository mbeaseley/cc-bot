import { Command, CommandMessage, Description } from '@typeit/discord';
import { Logger } from 'Services/logger.service';
import { MemeService } from 'Services/meme.service';
import { MemeItem } from 'Types/meme';
import Utility from 'Utils/utility';
import { ClientUser, Message, MessageEmbed } from 'discord.js';

export class Meme {
  private memeService: MemeService;
  private logger: Logger;

  constructor() {
    this.memeService = new MemeService();
    this.logger = new Logger();
  }

  /**
   * Create message
   * @param command
   * @param meme
   * @returns MessageEmbed
   */
  private createMessage(meme: MemeItem, user: ClientUser | null): MessageEmbed {
    return new MessageEmbed()
      .setColor(16738740)
      .setAuthor('Very Bad Meme Command', user?.displayAvatarURL())
      .setDescription(`**${meme.caption}**`)
      .setImage(meme.image || '');
  }

  /**
   * Meme Init
   * @param command
   */
  @Command('meme')
  @Description('Want a bad meme?')
  async init(command: CommandMessage): Promise<Message> {
    try {
      if (command.deletable) await command.delete();

      const msg = await Utility.sendMessage(
        command,
        '**:hourglass: Fetching Meme...**'
      );

      const res = await this.memeService.getMeme();
      await msg.delete();

      if (!res.image) {
        return Utility.sendMessage(
          command,
          '**No meme was found!**',
          'channel',
          5000
        );
      }

      const message = this.createMessage(res, command.client.user);
      return Utility.sendMessage(command, message);
    } catch (e: unknown) {
      if (command.deletable) await command.delete();
      this.logger.error(`Command: 'meme' has error: ${(e as Error).message}.`);
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

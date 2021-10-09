import { Command, CommandMessage, Description } from '@typeit/discord';
import { Logger } from 'Services/logger.service';
import { MemeService } from 'Services/meme.service';
import { MemeItem } from 'Types/meme';
import Translate from 'Utils/translate';
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
      .setAuthor(Translate.find('memeAuthor'), user?.displayAvatarURL())
      .setDescription(Translate.find('memeDescription'))
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
        Translate.find('memeFetch')
      );

      const res = await this.memeService.getMeme();
      await msg.delete();

      if (!res.image) {
        return Utility.sendMessage(
          command,
          Translate.find('noMeme'),
          'channel',
          5000
        );
      }

      const message = this.createMessage(res, command.client.user);
      return Utility.sendMessage(command, message);
    } catch (e: unknown) {
      if (command.deletable) await command.delete();
      this.logger.error(
        Translate.find('errorLog', 'meme', (e as Error).message)
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

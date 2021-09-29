import { Command, CommandMessage, Description } from '@typeit/discord';
import { AnimalsService } from 'Services/animals.service';
import { Logger } from 'Services/logger.service';
import { Animal } from 'Types/animal';
import Translate from 'Utils/translate';
import Utility from 'Utils/utility';
import { ClientUser, Message, MessageEmbed } from 'discord.js';

export class Cat {
  private animalsService: AnimalsService;
  private logger: Logger;

  constructor() {
    this.animalsService = new AnimalsService();
    this.logger = new Logger();
  }

  /**
   * Create message
   * @param command
   * @param meme
   * @returns MessageEmbed
   */
  private createMessage(animal: Animal, user: ClientUser | null): MessageEmbed {
    return new MessageEmbed()
      .setColor(25600)
      .setAuthor(Translate.find('catAuthor'), user?.displayAvatarURL())
      .setImage(animal.link || '');
  }

  /**
   * Cat Init
   * @param command
   */
  @Command('cat')
  @Description('Image of a cat?')
  async init(command: CommandMessage): Promise<Message> {
    try {
      if (command.deletable) await command.delete();

      const msg = await Utility.sendMessage(
        command,
        Translate.find('catFetch')
      );

      const res = await this.animalsService.getCat();
      await msg.delete();

      if (!res?.link) {
        return Utility.sendMessage(
          command,
          Translate.find('noCat'),
          'channel',
          5000
        );
      }

      const message = this.createMessage(res, command.client.user);
      return Utility.sendMessage(command, message);
    } catch (e: unknown) {
      if (command.deletable) await command.delete();
      this.logger.error(
        Translate.find('errorLog', 'cat', (e as Error).message)
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

import { Command, CommandMessage, Description } from '@typeit/discord';
import { AnimalsService } from 'Services/animals.service';
import { Logger } from 'Services/logger.service';
import { Animal } from 'Types/animal';
import Utility from 'Utils/utility';
import { ClientUser, Message, MessageEmbed } from 'discord.js';

export class Dog {
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
      .setColor(32768)
      .setAuthor('Dog Image Command', user?.displayAvatarURL())
      .setImage(animal.link || '');
  }

  /**
   * Dog Init
   * @param command
   */
  @Command('dog')
  @Description('Image of a dog?')
  async init(command: CommandMessage): Promise<Message> {
    try {
      if (command.deletable) await command.delete();

      const msg = await Utility.sendMessage(
        command,
        '**:hourglass: Fetching Dog...**'
      );

      const res = await this.animalsService.getDog();
      await msg.delete();

      if (!res?.link) {
        return Utility.sendMessage(
          command,
          '**No dog was found!**',
          'channel',
          5000
        );
      }

      const message = this.createMessage(res, command.client.user);
      return Utility.sendMessage(command, message);
    } catch (e: unknown) {
      if (command.deletable) await command.delete();
      this.logger.error(`Command: 'dog' has error: ${(e as Error).message}.`);
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

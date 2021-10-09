import { Command, CommandMessage, Description } from '@typeit/discord';
import { Logger } from 'Services/logger.service';
import Translate from 'Utils/translate';
import Utility from 'Utils/utility';
import chalk from 'chalk';
import { Message, MessageEmbed } from 'discord.js';
import * as urban from 'urban-dictionary';

export class UrbanDictionary {
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  /**
   * Create custom message
   * @param phrase
   * @param entry
   */
  private createMessage(
    phrase: string,
    entry: urban.DefinitionObject
  ): MessageEmbed {
    const lower = phrase.toLowerCase();
    const formattedPhrase = phrase.charAt(0).toUpperCase() + lower.slice(1);

    return new MessageEmbed()
      .setTitle(Translate.find('urbanTitle', formattedPhrase))
      .setColor(1079)
      .setURL(entry.permalink)
      .setThumbnail('https://i.imgur.com/LmyPRai.png')
      .setDescription(Translate.find('urbanDes'))
      .addField('👍', entry.thumbs_up, true)
      .addField('👎', entry.thumbs_down, true);
  }

  /**
   * Fetch definition of phrase from Urban Dictionary
   * @param command
   */
  @Command('urban')
  @Description('Get urban definition of word')
  async getDefinition(command: CommandMessage): Promise<Message | void> {
    try {
      if (command.deletable) await command.delete();

      const phrase = Utility.getOptionFromCommand(
        command.content,
        2,
        ' '
      ) as string;

      if (!phrase) {
        return Utility.sendMessage(
          command,
          Translate.find('urbanNoPhrase'),
          'channel',
          5000
        );
      }

      return urban.define(phrase, async (err, entries) => {
        if (err) {
          this.logger.error(`${chalk.bold('BOT ERROR')}: ${err.message}`);
          return Utility.sendMessage(
            command,
            Translate.find('urbanError'),
            'channel',
            5000
          );
        }

        const embed = this.createMessage(phrase, entries[0]);
        return Utility.sendMessage(command, embed);
      });
    } catch (e: unknown) {
      if (command.deletable) await command.delete();
      this.logger.error(
        Translate.find('errorLog', 'urban', (e as Error).message)
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

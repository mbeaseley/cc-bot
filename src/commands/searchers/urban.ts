import { Command, CommandMessage, Description } from '@typeit/discord';
import * as urban from 'urban-dictionary';
import { environment } from 'Utils/environment';
import { Logger } from 'Services/logger.service';
import * as chalk from 'chalk';
import { Message, MessageEmbed } from 'discord.js';
import Utility from 'Utils/utility';

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
      .setTitle(`${formattedPhrase} Definition`)
      .setColor(1079)
      .setURL(entry.permalink)
      .setThumbnail('https://i.imgur.com/LmyPRai.png')
      .setDescription(`${entry.definition}\nFor example: ${entry.example}`)
      .addField('👍', entry.thumbs_up, true)
      .addField('👎', entry.thumbs_down, true);
  }

  /**
   * Fetch definition of phrase from Urban Dictionary
   * @param command
   */
  @Command('urban')
  @Description('Get urban definition of word')
  getDefinition(command: CommandMessage): Promise<Message> | void {
    const phrase = Utility.getOptionFromCommand(
      command.content,
      2,
      ' '
    ) as string;

    if (!phrase) {
      if (command.deletable) command.delete();
      return command.reply('Try again, please add word to define!');
    }

    return urban.define(phrase, async (err, entries) => {
      if (err) {
        if (command.deletable) command.delete();
        this.logger.error(`${chalk.bold('BOT ERROR')}: ${err.message}`);
        return command.channel.send(environment.error);
      }

      const embed = this.createMessage(phrase, entries[0]);
      if (command.deletable) await command.delete();
      return command.channel.send(embed);
    });
  }
}

import { Command, CommandMessage, Description } from '@typeit/discord';
import { Logger } from 'Services/logger.service';
import Translate from 'Utils/translate';
import Utility from 'Utils/utility';
import { GuildMember, Message, MessageEmbed } from 'discord.js';

export class Disconnect {
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  /**
   * Create Message
   * @param member
   * @param description
   * @returns MessageEmbed
   */
  private createMessage(
    member: GuildMember,
    description: string
  ): MessageEmbed {
    return new MessageEmbed()
      .setColor(member.displayHexColor)
      .setDescription(description);
  }

  /**
   * Disconnect Init
   * @param command
   * @returns Promise<Message>
   */
  @Command('dc')
  @Description('Disconnect from voice channel')
  async init(command: CommandMessage): Promise<Message> {
    try {
      if (command.deletable) await command.delete();

      const botActive = command.guild?.me?.voice.channel;
      if (!botActive) {
        const message = this.createMessage(
          command.member as GuildMember,
          Translate.find('dcNotInChannel')
        );
        return Utility.sendMessage(command, message, 'channel', 5000);
      }

      botActive.leave();
      const message = this.createMessage(
        command.member as GuildMember,
        Translate.find('dcLeft')
      );
      return Utility.sendMessage(command, message);
    } catch (e: unknown) {
      if (command.deletable) await command.delete();
      this.logger.error(Translate.find('errorLog', 'dc', (e as Error).message));
      return Utility.sendMessage(
        command,
        Translate.find('errorDefault', (e as Error).message),
        'channel',
        5000
      );
    }
  }
}

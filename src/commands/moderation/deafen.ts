import { Command, CommandMessage, Description, Guard } from '@typeit/discord';
import { isAdmin } from 'Guards/isAdmin';
import { Logger } from 'Services/logger.service';
import Translate from 'Utils/translate';
import Utility from 'Utils/utility';
import { GuildMember, Message, MessageEmbed } from 'discord.js';

export class Deafen {
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  private createMessage(member: GuildMember): MessageEmbed {
    return new MessageEmbed()
      .setColor(member.displayHexColor)
      .setDescription(Translate.find('deafenSuccess', member.id));
  }

  /**
   * @name purgeInit
   * @param command
   * @description Delete messages in bulk (Admins only)
   * @returns
   */
  @Command('deafen')
  @Description('Deafen a user')
  @Guard(isAdmin)
  async init(command: CommandMessage): Promise<Message | void> {
    try {
      if (command.deletable) await command.delete();

      const username = Utility.getOptionFromCommand(
        command.content,
        2,
        ' '
      ) as string;

      const member = command.guild?.members.cache.find(
        (m) => !!username.indexOf(m.id)
      );

      if (!member?.id) {
        return Utility.sendMessage(
          command,
          Translate.find('noUser'),
          'channel',
          5000
        );
      }

      if (member.partial) {
        try {
          await member.fetch();
        } catch (e: unknown) {
          throw e;
        }
      }

      if (!member.voice.channel) {
        return Utility.sendMessage(
          command,
          Translate.find('notInVoiceChannel'),
          'channel',
          5000
        );
      }

      if (member.user.id === command.author.id) {
        return Utility.sendMessage(
          command,
          Translate.find('selfPunish'),
          'channel',
          10000
        );
      }

      await member.voice.setDeaf(true);
      const message = this.createMessage(member);
      return Utility.sendMessage(command, message, 'channel', 10000);
    } catch (e: unknown) {
      if (command.deletable) await command.delete();
      this.logger.error(
        Translate.find('errorLog', 'deafen', (e as Error).message)
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

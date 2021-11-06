import { Command, CommandMessage, Description, Guard } from '@typeit/discord';
import { isAdmin } from 'Guards/isAdmin';
import { Logger } from 'Services/logger.service';
import { ModerationService } from 'Services/moderation.service';
import Translate from 'Utils/translate';
import Utility from 'Utils/utility';
import { GuildMember, Message, MessageEmbed } from 'discord.js';

export class Undeafen {
  private logger: Logger;
  private moderationService: ModerationService;

  constructor() {
    this.logger = new Logger();
    this.moderationService = new ModerationService();
  }

  /**
   * Create message
   * @param member
   */
  private createMessage(member: GuildMember): MessageEmbed {
    return new MessageEmbed()
      .setColor(member.displayHexColor)
      .setDescription(Translate.find('undeafenSuccess', member.id));
  }

  /**
   * Undeafen init
   * @param command
   */
  @Command('undeafen')
  @Description('Undeafen a user')
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
        await member.fetch();
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

      await this.moderationService.setDeaf(member, false);
      const message = this.createMessage(member);
      return Utility.sendMessage(command, message, 'channel', 10000);
    } catch (e: unknown) {
      if (command.deletable) await command.delete();
      this.logger.error(
        Translate.find('errorLog', 'undeafen', (e as Error).message)
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

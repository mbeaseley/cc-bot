import { Command, CommandMessage, Description } from '@typeit/discord';
import { Logger } from 'Services/logger.service';
import Translate from 'Utils/translate';
import Utility from 'Utils/utility';
import { GuildMember, Message, MessageEmbed } from 'discord.js';

export class Join {
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  /**
   * Create Message
   * @param member
   * @param moved
   * @returns MessageEmbed
   */
  private createMessage(member: GuildMember, moved: boolean): MessageEmbed {
    const d = moved ? Translate.find('joinMoved') : Translate.find('join');
    return new MessageEmbed()
      .setColor(member.displayHexColor)
      .setDescription(d);
  }

  /**
   * Join Init
   * @param command
   * @returns Promise<Message | void>
   */
  @Command('join')
  @Description('Join voice channel')
  async init(command: CommandMessage): Promise<Message | void> {
    try {
      if (command.deletable) await command.delete();

      //Checks if user is in voice channel
      if (!command.member?.voice.channel) {
        return Utility.sendMessage(command, Translate.find('joinFail'));
      }

      // Check if VC is full and bot can't join doesn't have (MANAGE_CHANNELS)
      const memberVoice = command.member?.voice;
      const bot = command.guild?.me;
      if (
        !memberVoice.channel?.full &&
        bot &&
        !memberVoice.channel?.permissionsFor(bot)?.has('MANAGE_CHANNELS')
      ) {
        return Utility.sendMessage(
          command,
          Translate.find('joinFull'),
          'channel',
          10000
        );
      }

      const botActive = !!bot?.voice.channel;
      await memberVoice.channel?.join();
      await bot?.voice.setSelfDeaf(true);

      const message = this.createMessage(command.member, botActive);
      return Utility.sendMessage(command, message);
    } catch (e: unknown) {
      if (command.deletable) await command.delete();
      this.logger.error(
        Translate.find('errorLog', 'join', (e as Error).message)
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

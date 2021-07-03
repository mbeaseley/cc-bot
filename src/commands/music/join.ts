import { Command, CommandMessage, Description } from '@typeit/discord';
import { GuildMember, Message, MessageEmbed } from 'discord.js';
import { Logger } from '../../services/logger.service';

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
    const d = moved
      ? '**I have successfully moved to another voice channel.**'
      : '**I have successfully joined the voice channel.**';
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
      await command.delete();

      //Checks if user is in voice channel
      if (!command.member?.voice.channel) {
        return command.channel.send(
          '**You are not in a voice channel that I can join.**'
        );
      }

      // Check if VC is full and bot can't join doesn't have (MANAGE_CHANNELS)
      const memberVoice = command.member?.voice;
      const bot = command.guild?.me;
      if (
        !memberVoice.channel?.full &&
        bot &&
        !memberVoice.channel?.permissionsFor(bot)?.has('MANAGE_CHANNELS')
      ) {
        return command.channel
          .send('**The voice channel is full**')
          .then((m) => m.delete({ timeout: 10000 }));
      }

      const botActive = !!bot?.voice.channel;
      await memberVoice.channel?.join();
      await bot?.voice.setSelfDeaf(true);

      const message = this.createMessage(command.member, botActive);
      return command.channel.send(message);
    } catch (e: any) {
      await command.delete();
      this.logger.error(`Command: 'join' has error: ${e.message}.`);
      return command.channel
        .send(
          `The following error has occurred: ${e.message}. If this error keeps occurring, please contact support.`
        )
        .then((m) => m.delete({ timeout: 5000 }));
    }
  }
}

import { Command, CommandMessage, Description } from '@typeit/discord';
import { Logger } from 'Services/logger.service';
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
          '**I cannot leave a voice channel that I am not in!**'
        );
        return command.channel.send(message);
      }

      botActive.leave();
      const message = this.createMessage(
        command.member as GuildMember,
        '**I have left the voice channel.**'
      );
      return command.channel.send(message);
    } catch (e: unknown) {
      if (command.deletable) await command.delete();
      this.logger.error(`Command: 'join' has error: ${(e as Error).message}.`);
      return command.channel
        .send(
          `The following error has occurred: ${
            (e as Error).message
          }. If this error keeps occurring, please contact support.`
        )
        .then((m) => m.delete({ timeout: 5000 }));
    }
  }
}

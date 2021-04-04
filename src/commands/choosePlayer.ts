import { CommandMessage } from '@typeit/discord';
import { GuildChannel, User } from 'discord.js';

export class ChoosePlayer {
  private errorMessage = 'I have failed you!';

  /**
   * Get Author of command
   * @param command
   */
  getAuthor(command: CommandMessage): User {
    return command?.author;
  }

  findUserChannel(command: CommandMessage): GuildChannel | undefined {
    const voiceChannels = command?.guild?.channels?.cache?.filter(
      (c) => c.type === 'voice'
    );

    const author = this.getAuthor(command);

    const channel = voiceChannels?.find(
      (c) => !!c.members.find((m) => m.id === author.id)
    );

    return channel;
  }

  /**
   * Get unique username from channel
   * @param channel
   */
  getUsers(channel: GuildChannel | undefined): string[] {
    const users = channel?.members?.map((m) => {
      if (!m.user?.bot) {
        return m.user;
      }
    });

    if (!users?.length) {
      return [];
    }

    return users
      .filter((v, i, s) => v?.id && s.indexOf(v) === i)
      .map((u) => {
        return u?.username as string;
      });
  }

  /**
   * Init for player choice
   * @param command
   */
  public init(command: CommandMessage): Promise<void> {
    try {
      const channel = this.findUserChannel(command);
      const users = this.getUsers(channel);

      const content = !users?.length
        ? this.errorMessage
        : users[Math.floor(Math.random() * users.length)];

      command.reply(content);
      return Promise.resolve();
    } catch (e) {
      return Promise.reject();
    }
  }
}

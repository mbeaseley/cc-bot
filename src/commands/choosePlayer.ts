import { CommandMessage } from '@typeit/discord';
import { GuildChannel, User } from 'discord.js';

export class ChoosePlayer {
  /**
   * Get Author of command
   * @param command
   */
  getAuthor(command: CommandMessage): User {
    return command?.author;
  }

  private findUserChannel(command: CommandMessage): GuildChannel | undefined {
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
  private getUsers(channel: GuildChannel | undefined): string[] {
    const users = channel?.guild?.members?.cache.map((x) => {
      if (!x.user?.bot) {
        return x.user;
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
  public init(command: CommandMessage): Promise<string> {
    const channel = this.findUserChannel(command);

    const users = this.getUsers(channel);

    if (!users?.length) {
      return Promise.reject('Sorry I failed you!');
    }

    return Promise.resolve(users[Math.floor(Math.random() * users.length)]);
  }
}

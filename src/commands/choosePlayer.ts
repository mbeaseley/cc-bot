import { CommandMessage } from '@typeit/discord';
import { GuildChannel } from 'discord.js';

export class ChoosePlayer {
  private getChannel(
    command: CommandMessage,
    id: string
  ): GuildChannel | undefined {
    return command?.guild?.channels?.cache.get(id);
  }

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

  public init(command: CommandMessage): Promise<string> {
    // MOVE AWAy FROM DEFAULT ID
    const channel = this.getChannel(command, '787770844066611200');

    const users = this.getUsers(channel);

    if (!users?.length) {
      return Promise.reject('Sorry I failed you!');
    }

    return Promise.resolve(users[Math.floor(Math.random() * users.length)]);
  }
}

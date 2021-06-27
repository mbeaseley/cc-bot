import { Command, CommandMessage, Description } from '@typeit/discord';
import { GuildChannel, Message, User } from 'discord.js';
import { environment } from '../../utils/environment';
import Utility from '../../utils/utility';

export class ChoosePlayer {
  private currentUser: User | undefined;

  /**
   * Get random user that doesn't match previous
   * @param users
   */
  private getRandomUser(users: (User | undefined)[]): string {
    const u = users.filter((u) => u !== undefined);
    const previousUser = this.currentUser;

    if (users.length === 1) {
      return users[0]?.username as string;
    }

    while (this.currentUser?.id === previousUser?.id) {
      this.currentUser = u[Math.floor(Math.random() * u.length)] as User;
    }

    return this.currentUser?.username ?? environment.error;
  }

  /**
   * Get Author of command
   * @param command
   */
  private getAuthor(command: CommandMessage): User {
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
  private getUsers(
    channel: GuildChannel | undefined,
    excludeUsers: string[]
  ): (User | undefined)[] {
    let users = channel?.members?.map((m) => {
      if (!m.user?.bot) {
        return m.user;
      }
    });

    if (!users?.length) {
      return [];
    }

    users = users.filter((v, i, s) => v?.id && s.indexOf(v) === i);

    excludeUsers.forEach((e) => {
      const index = users?.findIndex((u) => u?.id === e);
      if (index) {
        users?.splice(index, 1);
      }
    });

    return users;
  }

  /**
   * Get exclude user id list
   * @param command
   */
  private getExcludeUsers(command: CommandMessage): string[] {
    const commandContent = Utility.getOptionFromCommand(
      command.content,
      2
    ) as string[];
    return commandContent.map((c) => c.replace(/^[0-9]*$/, ''));
  }

  /**
   * Init for player choice
   * @param command
   */
  private getResponse(command: CommandMessage): Promise<Message> {
    try {
      const channel = this.findUserChannel(command);
      const excludeUsers = this.getExcludeUsers(command);
      const users = this.getUsers(channel, excludeUsers);

      if (!users.length) {
        return Promise.reject('Please join a voicechat to use this command!');
      }

      const content = this.getRandomUser(users);

      return command.reply(content);
    } catch (e) {
      return Promise.reject();
    }
  }

  /**
   * @name playerInit
   * @param command
   * @description Command to choose player from voice channel
   * @returns
   */
  @Command('playerchoice')
  @Description('Chooses Player in voice chat')
  async init(command: CommandMessage): Promise<Message> {
    return this.getResponse(command).catch((e: string) => {
      return command.reply(e ? e : environment.error);
    });
  }
}

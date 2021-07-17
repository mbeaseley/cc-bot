import { Command, CommandMessage, Description } from '@typeit/discord';
import { Logger } from 'Services/logger.service';
import { environment } from 'Utils/environment';
import Utility from 'Utils/utility';
import {
  GuildChannel,
  GuildMember,
  Message,
  MessageEmbed,
  User,
} from 'discord.js';

export class ChoosePlayer {
  private currentUser: User | undefined;
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

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

  private findUserChannel(command: CommandMessage): GuildChannel | undefined {
    const voiceChannels = command?.guild?.channels?.cache?.filter(
      (c) => c.type === 'voice'
    );

    const author = Utility.getAuthor(command);

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
      return !m.user?.bot ? m.user : undefined;
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
   * Create message
   * @param content
   * @returns
   */
  private createMessage(content: string, member: GuildMember): MessageEmbed {
    return new MessageEmbed()
      .setColor(member.displayHexColor)
      .setDescription(`**I have chosen ${content}!**`);
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
    try {
      if (command.deletable) await command.delete();

      const msg = command.channel.send('**:hourglass: Choosing player...**');

      const channel = this.findUserChannel(command);
      const excludeUsers = this.getExcludeUsers(command);
      const users = this.getUsers(channel, excludeUsers);
      await (await msg).delete();

      if (!users.length) {
        return command.channel
          .send('**Please join a voicechat to use this command!**')
          .then((m) => m.delete({ timeout: 5000 }));
      }

      const content = this.getRandomUser(users);
      const message = this.createMessage(
        content,
        command.member as GuildMember
      );
      return command.channel.send(message);
    } catch (e: unknown) {
      if (command.deletable) await command.delete();
      this.logger.error(
        `Command: 'playerchoice' has error: ${(e as Error).message}.`
      );
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

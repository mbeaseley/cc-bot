import { Command, CommandMessage, Description } from '@typeit/discord';
import { Logger } from 'Services/logger.service';
import { TwitchService } from 'Services/twitch.service';
import { Followers, Stream, User } from 'Types/twitch';
import Utility from 'Utils/utility';
import { Message, MessageEmbed } from 'discord.js';

export class Twitch {
  private logger: Logger;
  private twitchService: TwitchService;

  constructor() {
    this.logger = new Logger();
    this.twitchService = new TwitchService();
  }

  /**
   * Create Embed Message
   * @param user
   * @param followers
   * @param stream
   * @returns MessageEmbed
   */
  private createMessage(
    user: User,
    followers: Followers,
    stream: Stream
  ): MessageEmbed {
    const m = new MessageEmbed()
      .setTitle(user.displayName)
      .setColor(6570405)
      .setURL(`https://twitch.tv/${user.loginName}`)
      .setThumbnail(`${user.profileImageUrl}`)
      .setAuthor('Twitch', 'https://i.imgur.com/4b9X738.png')
      .addField(
        `Biography: `,
        user.description || `This user doesn't have a biography.`,
        true
      )
      .addField(`Total Views: `, user.viewCount || `~`, true)
      .addField(`Followers: `, followers.total, true);

    if (stream?.id) {
      m.addField(
        '\u200B',
        `**${stream.title}** for ${stream.viewerCount} viewers`
      ).setImage(
        `${stream.thumbnailUrl
          ?.replace('{width}', `${1920}`)
          .replace('{height}', `${1080}`)}`
      );
    }

    return m;
  }

  @Command('twitch')
  @Description('Find your favourites streamers')
  async init(command: CommandMessage): Promise<void | Message> {
    try {
      if (command.deletable) await command.delete();

      const msg = command.channel.send('**:hourglass: Fetching account...**');

      const username = Utility.getOptionFromCommand(
        command.content,
        2,
        ' '
      ) as string;

      const user = await this.twitchService.getUser(username);
      if (user?.id) {
        const stream = await this.twitchService.getStreams(username);
        const followers = await this.twitchService.getFollowersById(user.id);
        await (await msg).delete();
        const message = this.createMessage(user, followers, stream);

        return command.channel.send(message);
      } else {
        await (await msg).delete();
        return command.channel.send('**Twitch user not found.**');
      }
    } catch (e: unknown) {
      if (command.deletable) await command.delete();
      this.logger.error(
        `Command: 'twitch' has error: ${(e as Error).message}.`
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

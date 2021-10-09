import { Command, CommandMessage, Description } from '@typeit/discord';
import { Logger } from 'Services/logger.service';
import { TwitchService } from 'Services/twitch.service';
import { Followers, Stream, User } from 'Types/twitch';
import Translate from 'Utils/translate';
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
      .setURL(Translate.find('twitchUrl'))
      .setThumbnail(`${user.profileImageUrl}`)
      .setAuthor(
        Translate.find('twitchAuthor'),
        'https://i.imgur.com/4b9X738.png'
      )
      .addField(
        Translate.find('twitchBio'),
        user.description || Translate.find('twitchNoUser'),
        true
      )
      .addField(Translate.find('twitchViews'), user.viewCount || `~`, true)
      .addField(Translate.find('twitchFollowers'), followers.total, true);

    if (stream?.id) {
      m.addField(
        '\u200B',
        Translate.find(
          'twitchSteam',
          stream.title || '~',
          stream.viewerCount?.toString() || '~'
        )
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

      const msg = await Utility.sendMessage(
        command,
        Translate.find('twitchFetch')
      );

      const username = Utility.getOptionFromCommand(
        command.content,
        2,
        ' '
      ) as string;

      const user = await this.twitchService.getUser(username);
      if (user?.id) {
        const stream = await this.twitchService.getStreams(username);
        const followers = await this.twitchService.getFollowersById(user.id);
        await msg.delete();
        const message = this.createMessage(user, followers, stream);

        return Utility.sendMessage(command, message);
      } else {
        await msg.delete();
        return Utility.sendMessage(command, Translate.find('twitchNotFound'));
      }
    } catch (e: unknown) {
      if (command.deletable) await command.delete();
      this.logger.error(
        Translate.find('errorLog', 'twitch', (e as Error).message)
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

import { Logger } from 'Services/logger.service';
import { TwitchService } from 'Services/twitch.service';
import { Followers, Stream, User } from 'Types/twitch';
import { Command } from 'Utils/command';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';

@Discord()
export abstract class Twitch extends Command {
  private twitchService: TwitchService;
  private logger: Logger;

  constructor() {
    super();
    this.twitchService = new TwitchService();
    this.logger = new Logger();
  }

  /**
   * Create Embed Message
   * @param user
   * @param followers
   * @param stream
   * @returns MessageEmbed
   */
  private createMessage(user: User, followers: Followers, stream: Stream): MessageEmbed {
    const m = new MessageEmbed()
      .setTitle(user.displayName ?? '~')
      .setColor(6570405)
      .setURL(this.c('twitchUrl', user?.loginName ?? ''))
      .setThumbnail(`${user.profileImageUrl}`)
      .setAuthor({
        name: this.c('twitchAuthor'),
        iconURL: 'https://i.imgur.com/4b9X738.png'
      })
      .addField(this.c('twitchBio'), user.description || this.c('twitchNoUser'), true)
      .addField(this.c('twitchViews'), user.viewCount?.toString() ?? '~', true)
      .addField(this.c('twitchFollowers'), followers?.total?.toString() ?? '~', true);

    if (stream?.id) {
      m.addField(
        '\u200B',
        this.c('twitchSteam', stream.title || '~', stream.viewerCount?.toString() || '~')
      ).setImage(
        `${stream.thumbnailUrl?.replace('{width}', `${1920}`).replace('{height}', `${1080}`)}`
      );
    }

    return m;
  }

  /**
   * Twitch command init
   * @param username
   * @param interaction
   */
  @Slash('twitch', {
    description: 'Find your favourites streamers.'
  })
  async init(
    @SlashOption('user', {
      description: 'Username?'
    })
    username: string,
    interaction: CommandInteraction
  ): Promise<void> {
    let user: User | undefined;

    try {
      user = await this.twitchService.getUser(username);
    } catch (e: unknown) {
      this.logger.error(this.c('twitchUserError'));
    }

    if (!user?.id) {
      await interaction.reply(this.c('twitchNotFound'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const stream = await this.twitchService.getStreams(username);
    const followers = await this.twitchService.getFollowersById(user.id);
    const msg = this.createMessage(user, followers, stream);
    return interaction.reply({ embeds: [msg] });
  }
}

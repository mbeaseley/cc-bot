import { TwitchService } from 'Services/twitch.service';
import { Followers, Stream, User } from 'Types/twitch';
import { Command } from 'Utils/command';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';

@Discord()
export abstract class Twitch extends Command {
  private twitchService: TwitchService;

  constructor() {
    super();
    this.twitchService = new TwitchService();
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
      .setURL(this.c('twitchUrl'))
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
    const user = await this.twitchService.getUser(username);

    if (!user.id) {
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

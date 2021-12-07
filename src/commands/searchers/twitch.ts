import { TwitchService } from 'Services/twitch.service';
import { Followers, Stream, User } from 'Types/twitch';
import Translate from 'Utils/translate';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';

@Discord()
export abstract class Twitch {
  private twitchService: TwitchService;

  constructor() {
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
      .setURL(Translate.find('twitchUrl'))
      .setThumbnail(`${user.profileImageUrl}`)
      .setAuthor(Translate.find('twitchAuthor'), 'https://i.imgur.com/4b9X738.png')
      .addField(
        Translate.find('twitchBio'),
        user.description || Translate.find('twitchNoUser'),
        true
      )
      .addField(Translate.find('twitchViews'), user.viewCount?.toString() ?? '~', true)
      .addField(Translate.find('twitchFollowers'), followers?.total?.toString() ?? '~', true);

    if (stream?.id) {
      m.addField(
        '\u200B',
        Translate.find('twitchSteam', stream.title || '~', stream.viewerCount?.toString() || '~')
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
      description: 'Username?',
      required: true
    })
    username: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const user = await this.twitchService.getUser(username);

    if (!user.id) {
      await interaction.reply(Translate.find('twitchNotFound'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const stream = await this.twitchService.getStreams(username);
    const followers = await this.twitchService.getFollowersById(user.id);
    const msg = this.createMessage(user, followers, stream);
    return interaction.reply({ embeds: [msg] });
  }
}

import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import Translate from '../../utils/translate';
import { InstagramService } from '../../services/instagram.service';
import { InstaUser } from '../../types/instagram';

@Discord()
export abstract class Instagram {
  private instagramService: InstagramService;

  constructor() {
    this.instagramService = new InstagramService();
  }

  /**
   * Create message
   * @param u
   */
  private createMessage(u: InstaUser): MessageEmbed {
    return new MessageEmbed()
      .setColor(0x0099ff)
      .setTitle(u.fullName ?? '~')
      .setURL(Translate.find('instaUrl', u.username as string))
      .setThumbnail(u.profileImage ?? '')
      .addField(Translate.find('instaUsernameHeader'), u.username ?? '~')
      .addField(Translate.find('instaNameHeader'), u.fullName ?? '~')
      .addField(Translate.find('instaBioHeader'), u.biography ?? '~')
      .addField(
        Translate.find('instaPostHeader'),
        u.posts?.toString() ?? '~',
        true
      )
      .addField(
        Translate.find('instaFollowersHeader'),
        u.followers?.toString() || '~',
        true
      )
      .addField(
        Translate.find('instaFollowingHeader'),
        u.following?.toString() || '~',
        true
      )
      .addField(
        Translate.find('instaPrivateHeader'),
        u.private ? 'Yes 🔐' : 'No 🔓',
        true
      )
      .addField(
        Translate.find('instaVerifiedHeader'),
        u.verified ? 'Yes ✅' : 'No ❌',
        true
      );
  }

  /**
   * Instagram Command
   * @param user
   * @param interaction
   */
  @Slash('instagram', { description: 'Find someone you know on Instagram' })
  async init(
    @SlashOption('user', {
      description: 'Username?',
      required: true,
    })
    user: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const userAccount = await this.instagramService.getInstaUser(user);

    if (!userAccount) {
      await interaction.reply('**No valid instagram username was given!**');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const msg = this.createMessage(userAccount);
    return interaction.reply({ embeds: [msg] });
  }
}

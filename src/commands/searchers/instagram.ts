import { instagramService } from 'Services/instagram.service';
import { InstaUser } from 'Types/instagram';
import { Command } from 'Utils/command';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';

@Discord()
export abstract class Instagram extends Command {
  constructor() {
    super();
  }

  /**
   * Create message
   * @param u
   */
  private createMessage(u: InstaUser): MessageEmbed {
    return new MessageEmbed()
      .setColor(0x0099ff)
      .setTitle(u.fullName ?? '~')
      .setURL(this.c('instaUrl', u.username as string))
      .setThumbnail(u.profileImage ?? '')
      .addField(this.c('instaUsernameHeader'), u.username ?? '~')
      .addField(this.c('instaNameHeader'), u.fullName ?? '~')
      .addField(this.c('instaBioHeader'), u.biography?.length ? u.biography : '~')
      .addField(this.c('instaPostHeader'), u.posts?.toString() ?? '~', true)
      .addField(this.c('instaFollowersHeader'), u.followers?.toString() || '~', true)
      .addField(this.c('instaFollowingHeader'), u.following?.toString() || '~', true)
      .addField(this.c('instaPrivateHeader'), u.private ? 'Yes 🔐' : 'No 🔓', true)
      .addField(this.c('instaVerifiedHeader'), u.verified ? 'Yes ✅' : 'No ❌', true);
  }

  /**
   * Instagram Command
   * @param user
   * @param interaction
   */
  @Slash('instagram', {
    description: 'Find someone you know on Instagram.'
  })
  async init(
    @SlashOption('user', {
      description: 'Username?'
    })
    user: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const userAccount = await instagramService.getInstaUser(user);

    if (!userAccount) {
      await interaction.reply(this.c('instaNoUser'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const msg = this.createMessage(userAccount);
    return interaction.reply({ embeds: [msg] });
  }
}

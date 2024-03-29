import { Command } from 'Utils/command';
import { environment } from 'Utils/environment';
import { CommandInteraction, GuildMember, MessageEmbed, TextChannel, User } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';

@Discord()
export class Support extends Command {
  constructor() {
    super();
  }

  /**
   * create support message
   * @param support
   * @param member
   * @param bot
   * @returns MessageEmbed
   */
  private createSupportMessage(
    support: string,
    member: GuildMember | undefined,
    fallbackUser: User,
    bot?: User
  ): MessageEmbed {
    return new MessageEmbed()
      .setColor(member?.displayHexColor ?? 11166957)
      .setAuthor({
        name: this.c('supportTitle', member?.nickname || fallbackUser?.username || '~'),
        iconURL: bot?.displayAvatarURL()
      })
      .setDescription(support);
  }

  /**
   * Create success message
   * @param member
   * @param bot
   * @returns MessageEmbed
   */
  private createSuccessMessage(member: GuildMember, bot?: User): MessageEmbed {
    return new MessageEmbed()
      .setColor(member.displayHexColor ?? 11166957)
      .setAuthor({ name: this.c('supportSuccessTitle'), iconURL: bot?.displayAvatarURL() })
      .setDescription('Thankyou for the sending your request!');
  }

  /**
   * Support init
   * @param support
   * @param interaction
   */
  @Slash('support', {
    description:
      'miscellaneous command, having issues, want to suggest a feature, use this command!'
  })
  async init(
    @SlashOption('support', {
      description: 'Please add your support request here'
    })
    support: string,
    interaction: CommandInteraction
  ): Promise<any> {
    try {
      const member = await (interaction.member as GuildMember).fetch();
      const guild = interaction.guild?.fetch();
      const bot = await interaction.client.user?.fetch();

      if (!guild) {
        throw new Error();
      }

      const channel = (await guild).channels.cache.find(
        (c) => c.id === environment.feedbackChannel && c.isText()
      ) as TextChannel;

      if (!channel) {
        throw new Error();
      }

      const msg = this.createSupportMessage(support, member, member?.user, bot);
      await channel.send({ embeds: [msg] });
      const successMsg = this.createSuccessMessage(member, bot);
      await interaction.reply({ embeds: [successMsg] });
    } catch (e: unknown) {
      await interaction.reply(this.c('unexpectedError'));
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
    return interaction.deleteReply();
  }
}

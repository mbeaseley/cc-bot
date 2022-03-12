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
  private createSupportMessage(support: string, member?: GuildMember, bot?: User): MessageEmbed {
    return new MessageEmbed()
      .setColor(member?.displayHexColor ?? 11166957)
      .setAuthor({
        name: this.c('supportTitle', member?.nickname ?? '~'),
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
    description: 'Having issues within the discord, want to suggest a feature, use this command!'
  })
  async init(
    @SlashOption('support', {
      description: 'Please add your support request here'
    })
    support: string,
    interaction: CommandInteraction
  ): Promise<any> {
    const member = await (interaction.member as GuildMember).fetch();
    const guild = interaction.guild?.fetch();
    const bot = await interaction.client.user?.fetch();

    if (!guild) {
      return interaction.deleteReply();
    }

    const channel = (await guild).channels.cache.find(
      (c) => c.id === environment.feedbackChannel && c.isText()
    ) as TextChannel;

    if (!channel) {
      return interaction.deleteReply();
    }

    const msg = this.createSupportMessage(support, member, bot);
    await channel.send({ embeds: [msg] });
    const successMsg = this.createSuccessMessage(member, bot);
    await interaction.reply({ embeds: [successMsg] });
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return interaction.deleteReply();
  }
}

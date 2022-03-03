import { ComplimentService } from 'Services/compliment.service';
import { Command } from 'Utils/command';
import { ClientUser, CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';

@Discord()
export abstract class Compliment extends Command {
  private complimentService: ComplimentService;

  constructor() {
    super();
    this.complimentService = new ComplimentService();
  }

  /**
   * Create Message for compliment command
   * @param compliment
   * @param user
   * @returns MessageEmbed
   */
  private createMessage(compliment: string, user: ClientUser | null): MessageEmbed {
    return new MessageEmbed()
      .setAuthor({ name: this.c('complimentTitle'), iconURL: user?.displayAvatarURL() })
      .setColor('RANDOM')
      .setDescription(compliment);
  }

  /**
   * Compliment Command
   * @param user
   * @param interaction
   */
  @Slash('compliment', {
    description: `Send a nice compliment to yourself or a friend.`
  })
  async init(
    @SlashOption('user', {
      description: 'Who do you want to send a compliment to?',
      required: false
    })
    user: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const { compliment } = await this.complimentService.getCompliment();

    if (!compliment) {
      await interaction.reply(this.c('noCompliment'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const complimentString = user ? `${user}, ${compliment}` : compliment;
    const msg = this.createMessage(complimentString, interaction.client.user);
    return interaction.reply({ embeds: [msg] });
  }
}

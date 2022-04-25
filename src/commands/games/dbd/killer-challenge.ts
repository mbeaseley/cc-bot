import { DBDService } from 'Services/dbd.service';
import { Command } from 'Utils/command';
import { ClientUser, CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash, SlashChoice, SlashGroup, SlashOption } from 'discordx';

@Discord()
@SlashGroup({ name: 'dbd', description: 'Dead By Daylight Commands' })
@SlashGroup('dbd')
export class KillerChallenge extends Command {
  private dbdService: DBDService;

  constructor() {
    super();
    this.dbdService = new DBDService();
  }

  /**
   * Create message
   * @param string
   * @param user
   * @returns MessageEmbed
   */
  private createMessage(string: string, user: ClientUser | null): MessageEmbed {
    return new MessageEmbed()
      .setAuthor({
        name: 'DBD Killer challenge',
        iconURL: user?.displayAvatarURL()
      })
      .setColor(10181046)
      .setDescription(string);
  }

  /**
   * Complete DM action for sending challenge
   * @param interaction
   * @param challenge
   */
  private async onSendingDM(interaction: CommandInteraction, challenge: string): Promise<void> {
    const users = await interaction.guild?.members.fetch();
    const user = users?.find((u) => u.id === interaction.member?.user.id);

    if (!user) {
      await interaction.reply(this.c('dbdNoMember'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const challengeMsg = this.createMessage(challenge, interaction.client.user);

    const dmChannel = await user.createDM(true);
    await dmChannel.send({ embeds: [challengeMsg] });

    await interaction.reply(this.c('dbdKillerChallengeSent'));
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return interaction.deleteReply();
  }

  @Slash('killer-challenge', {
    description: 'Get a random dbd killer challenge'
  })
  async init(
    @SlashChoice('Yes', 'true')
    @SlashChoice('No', 'false')
    @SlashOption('dm', {
      description: 'Do you want the challenge to be dm only to you?'
    })
    dm: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const challenge = await this.dbdService.getKillerChallenge();

    if (!challenge) {
      await interaction.reply(this.c('dbdNoChallenge'));
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return interaction.deleteReply();
    }

    if (dm === 'true') {
      return this.onSendingDM(interaction, challenge);
    }

    const challengeMsg = this.createMessage(challenge, interaction.client.user);
    return interaction.reply({ embeds: [challengeMsg] });
  }
}

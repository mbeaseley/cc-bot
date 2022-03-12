import { Command } from 'Utils/command';
import {
  ButtonInteraction,
  Collection,
  CommandInteraction,
  GuildCacheMessage,
  GuildMember,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  User
} from 'discord.js';
import { ButtonComponent, Discord, Slash } from 'discordx';

@Discord()
export abstract class ChoosePlayer extends Command {
  private currentUser: User | undefined;
  private previousInteraction: CommandInteraction | ButtonInteraction | undefined;

  constructor() {
    super();
  }

  /**
   * Find random user from voice channel
   * @param members
   * @returns User
   */
  findRandomUser(members: Collection<string, GuildMember>): User | undefined {
    const u = members.map((m) => m.user).filter((user) => user.id !== undefined);
    const previousUser = this.currentUser;

    if (u?.length === 1) {
      return u[0];
    }

    while (this.currentUser?.id === previousUser?.id) {
      this.currentUser = u[Math.floor(Math.random() * u.length)] as User;
    }

    return this.currentUser as User;
  }

  /**
   * Create message
   * @param content
   */
  private createMessage(selectedUser: User): MessageEmbed {
    return new MessageEmbed()
      .setColor(selectedUser.hexAccentColor ?? 'RANDOM')
      .setDescription(this.c('playerChoiceDescription', selectedUser.username));
  }

  /**
   * Interaction events
   * @param interaction
   * @param users
   * @param msg
   */
  async onInteractionEvent(
    interaction: CommandInteraction | ButtonInteraction,
    users: Collection<string, GuildMember>,
    msg: MessageEmbed
  ): Promise<any> {
    if (users.size > 1) {
      await interaction.deferReply();

      const rollAgainBtn = new MessageButton()
        .setLabel(this.c('playerChoiceCta'))
        .setEmoji('🎲')
        .setStyle('SECONDARY')
        .setCustomId('roll-again-btn');

      const row = new MessageActionRow().addComponents([rollAgainBtn]);

      return interaction.editReply({
        embeds: [msg],
        components: [row]
      });
    } else {
      return interaction.reply({ embeds: [msg] });
    }
  }

  /**
   * Choose player command
   * @param interaction
   */
  @Slash('choose-player', {
    description: 'Chooses Player in voice chat.'
  })
  async init(
    interaction: CommandInteraction | ButtonInteraction
  ): Promise<GuildCacheMessage<any> | void> {
    this.previousInteraction = interaction;
    const users = await interaction.guild?.members.fetch();
    const user = users?.find((u) => u.id === interaction.member?.user.id);

    if (!user) {
      await interaction.reply(this.c('playerChoiceUserError'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const channel = user?.voice.channel;

    if (!channel) {
      await interaction.reply(this.c('playerChoiceChannelError'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const channelUsers = channel?.members.filter((m) => !m.user.bot);
    const selectedUser = this.findRandomUser(channelUsers);

    if (!selectedUser) {
      await interaction.reply(this.c('playerChoiceSelectedError'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const msg = this.createMessage(selectedUser);
    return this.onInteractionEvent(interaction, channelUsers, msg);
  }

  /**
   * Heads Button Interaction
   * @param interaction
   */
  @ButtonComponent('roll-again-btn')
  async headsAction(interaction: ButtonInteraction): Promise<GuildCacheMessage<any> | void> {
    await this.previousInteraction?.deleteReply();
    return this.init(interaction);
  }
}

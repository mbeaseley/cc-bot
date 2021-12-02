import {
  ButtonInteraction,
  Collection,
  CommandInteraction,
  GuildCacheMessage,
  GuildMember,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  User
} from 'discord.js';
import { ButtonComponent, Discord, Slash } from 'discordx';
import Translate from 'Utils/translate';

@Discord()
export abstract class ChoosePlayer {
  private currentUser: User | undefined;
  private previousInteraction: CommandInteraction | ButtonInteraction | undefined;

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
      .setDescription(Translate.find('playerChoiceDescription', selectedUser.username));
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
  ): Promise<GuildCacheMessage<any> | void> {
    if (users.size > 1) {
      await interaction.deferReply();

      const rollAgainBtn = new MessageButton()
        .setLabel('Someone else?')
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
    let users = await interaction.guild?.members.fetch();
    let user = users?.find((u) => u.id === interaction.member.user.id);

    if (!user) {
      await interaction.reply('**Sorry, failed to find user!**');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const channel = user?.voice.channel;

    if (!channel) {
      await interaction.reply('**Please join voice channel to use this command!**');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const channelUsers = channel?.members.filter((m) => !m.user.bot);
    const selectedUser = this.findRandomUser(channelUsers);

    if (!selectedUser) {
      await interaction.reply('**Sorry, failed to select user!**');
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

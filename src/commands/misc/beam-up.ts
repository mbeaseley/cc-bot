import { BeamUpItem } from 'Types/beam-up';
import { Command } from 'Utils/command';
import {
  ButtonInteraction,
  ClientUser,
  Collection,
  CommandInteraction,
  GuildChannel,
  GuildChannelManager,
  GuildMember,
  MessageActionRow,
  MessageButton,
  MessageEmbed
} from 'discord.js';
import { ButtonComponent, Discord, Slash, SlashOption } from 'discordx';

@Discord()
export abstract class BeamUp extends Command {
  private _beamUpItem: BeamUpItem | undefined;
  private author: GuildMember | undefined;
  private selectedUser: GuildMember | undefined;
  private previousInteraction: CommandInteraction | undefined;

  /**
   * Get beamUpItem
   */
  get beamUpItem(): BeamUpItem | undefined {
    return this._beamUpItem ?? undefined;
  }

  /**
   * Set beamUpItem
   */
  set beamUpItem(value: BeamUpItem | undefined) {
    this._beamUpItem = value;
  }

  /**
   * Find voice channel voice is on
   * @param channels
   * @param userId
   */
  private findUserChannel(
    channels: GuildChannelManager | undefined,
    member: GuildMember
  ): GuildChannel | undefined {
    const voiceChannels = channels?.cache?.filter(
      (c) => c.isVoice() && c.type === 'GUILD_VOICE'
    ) as Collection<string, GuildChannel>;

    return voiceChannels.find((c) => c.isVoice() && c.id === member.voice.channelId);
  }

  /**
   * Create message
   * @param command
   */
  private createMessage(description: string, member?: GuildMember, bot?: ClientUser): MessageEmbed {
    return new MessageEmbed()
      .setColor(member?.displayHexColor ?? 11166957)
      .setAuthor({ name: this.c('beamUpAuthor'), iconURL: bot?.displayAvatarURL() })
      .setDescription(description);
  }

  /**
   * Beam Up Command
   * @param interaction
   */
  @Slash('beam-up', {
    description: 'Beam up member to restrictive voice channel!'
  })
  async init(
    @SlashOption('user', {
      description: 'Who do you want to join?'
    })
    user: string,
    interaction: CommandInteraction
  ): Promise<any> {
    this.previousInteraction = interaction;
    const { member, guild, client } = interaction;
    const members = await guild?.members.fetch();
    const u = members?.find((m) => m.id === member?.user.id);
    this.selectedUser = guild?.members.cache.find((m) => m.id === user.replace(/\D/g, ''));

    if (!u?.id || !this.selectedUser?.id) {
      const noRestrictmsg = this.createMessage(
        this.c('beamUpNoUserFound'),
        this.author,
        client.user ?? undefined
      );
      await interaction.reply({ embeds: [noRestrictmsg] });
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const voiceChannel = this.findUserChannel(guild?.channels, this.selectedUser);

    const validChannel = !voiceChannel?.permissionsFor(u).has('CONNECT', false)
      ? voiceChannel
      : undefined;

    this.author = u;

    if (!validChannel?.id) {
      const noRestrictmsg = this.createMessage(
        this.c('beamUpNotRestrictive'),
        this.author,
        client.user ?? undefined
      );
      await interaction.reply({ embeds: [noRestrictmsg] });
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    await interaction.deferReply();

    this.beamUpItem = new BeamUpItem(validChannel, u);
    const msg = this.createMessage(
      this.c(
        'beamUpDescription',
        member?.user.id ?? '~',
        this.selectedUser.id,
        this.selectedUser.id
      ),
      this.author,
      client.user ?? undefined
    );

    const acceptBtn = new MessageButton()
      .setLabel(this.c('beamUpAccept'))
      .setEmoji('✅')
      .setStyle('PRIMARY')
      .setCustomId('accept-btn');

    const rejectBtn = new MessageButton()
      .setLabel(this.c('beamUpReject'))
      .setEmoji('🛑')
      .setStyle('SECONDARY')
      .setCustomId('reject-btn');

    const row = new MessageActionRow().addComponents([acceptBtn, rejectBtn]);

    return interaction.editReply({
      embeds: [msg],
      components: [row]
    });
  }

  /**
   * Check if moderator based on roles
   * @param interaction
   * @returns Promise<boolean>
   */
  private async isSelectedUser(interaction: ButtonInteraction): Promise<boolean> {
    const { member, guild } = interaction;
    const members = await guild?.members.fetch();
    const user = members?.find((m) => m.id === member?.user.id);
    return user?.id === this.selectedUser?.id;
  }

  /**
   * Allows guild member to join restrictive channel
   */
  private async moveMemberToChannel(): Promise<GuildMember | void> {
    const vc = this.beamUpItem?.voiceChannel;
    if (vc?.id && this.author?.id) {
      return this.beamUpItem?.member?.voice.setChannel(vc.id.toString());
    }

    return Promise.resolve();
  }

  /**
   * Accept Action Button
   * @param interaction
   */
  @ButtonComponent('accept-btn')
  async acceptAction(interaction: ButtonInteraction): Promise<void> {
    const isValid = await this.isSelectedUser(interaction);
    if (!isValid) {
      return Promise.resolve();
    }

    await this.moveMemberToChannel();
    await this.previousInteraction?.deleteReply();
    const msg = this.createMessage(
      this.c('beamUpRequestAccepted', this.author?.id ?? ''),
      this.author,
      interaction.client.user ?? undefined
    );
    await interaction.reply({ embeds: [msg] });
    await new Promise((resolve) => setTimeout(resolve, 10000));
    return interaction.deleteReply();
  }

  /**
   * Reject Action Button
   * @param interaction
   */
  @ButtonComponent('reject-btn')
  async rejectAction(interaction: ButtonInteraction): Promise<void> {
    const isValid = await this.isSelectedUser(interaction);
    if (!isValid) {
      return Promise.resolve();
    }

    await this.previousInteraction?.deleteReply();
    const msg = this.createMessage(
      this.c('beamUpRequestRejected', this.author?.id ?? ''),
      this.author,
      interaction.client.user ?? undefined
    );
    await interaction.reply({ embeds: [msg] });
    await new Promise((resolve) => setTimeout(resolve, 10000));
    return interaction.deleteReply();
  }
}

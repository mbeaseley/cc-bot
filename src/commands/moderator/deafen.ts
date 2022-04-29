import { ModerationService } from 'Services/moderation.service';
import { Command } from 'Utils/command';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';

@Discord()
export abstract class Mute extends Command {
  private moderationService: ModerationService;

  constructor() {
    super();
    this.moderationService = new ModerationService();
  }

  /**
   * Create message
   * @param member
   */
  private createMessage(member: GuildMember): MessageEmbed {
    return new MessageEmbed()
      .setColor(member.displayHexColor)
      .setDescription(this.c('deafenSuccess', member.id));
  }

  /**
   * Deafen command
   * @param user
   * @param interaction
   */
  @Slash('deafen', {
    description: 'Deafen a user! Command: /deaf user(required)'
  })
  async init(
    @SlashOption('user', {
      description: 'Who do you want to deafen?'
    })
    user: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const userId = user.replace(/\D/g, '');
    const { member, guild } = interaction;
    const members = await guild?.members.fetch();
    const target = members?.find((m) => m.id === userId);

    if (!target?.id) {
      await interaction.reply(this.c('noUser'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    if (!target.voice.channel) {
      await interaction.reply(this.c('notInVoiceChannel'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    if (target.user.id === member?.user.id) {
      await interaction.reply(this.c('selfPunish'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    await this.moderationService.setDeaf(target, true);
    const msg = this.createMessage(target);
    return interaction.reply({ embeds: [msg] });
  }
}

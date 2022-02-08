import { hasPermission } from 'Guards/has-permission';
import { ModerationService } from 'Services/moderation.service';
import { environment } from 'Utils/environment';
import Translate from 'Utils/translate';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import { Discord, Permission, Slash, SlashOption } from 'discordx';

@Discord()
@Permission(false)
@Permission(hasPermission(environment.moderatorRoles))
export abstract class Mute {
  private moderationService: ModerationService;

  constructor() {
    this.moderationService = new ModerationService();
  }

  /**
   * Create message
   * @param member
   */
  private createMessage(member: GuildMember): MessageEmbed {
    return new MessageEmbed()
      .setColor(member.displayHexColor)
      .setDescription(Translate.find('undeafenSuccess', member.id));
  }

  /**
   * Undeafen command
   * @param user
   * @param interaction
   */
  @Slash('undeafen', {
    description: 'Undeafen a user!'
  })
  async init(
    @SlashOption('user', {
      description: 'Who do you want to undeafen?'
    })
    user: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const userId = user.replace(/\D/g, '');
    const { guild } = interaction;
    const members = await guild?.members.fetch();
    const target = members?.find((m) => m.id === userId);

    if (!target?.id) {
      await interaction.reply(Translate.find('noUser'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    if (!target.voice.channel) {
      await interaction.reply(Translate.find('notInVoiceChannel'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    await this.moderationService.setDeaf(target, false);
    const msg = this.createMessage(target);
    return interaction.reply({ embeds: [msg] });
  }
}

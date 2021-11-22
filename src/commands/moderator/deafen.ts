import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import { Discord, Permission, Slash, SlashOption } from 'discordx';
import { ModerationService } from '../../services/moderation.service';
import { environment } from '../../utils/environment';
import Translate from '../../utils/translate';

@Discord()
@Permission(false)
@Permission({
  id: environment.moderatorRoles[0],
  type: 'ROLE',
  permission: true,
})
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
      .setDescription(Translate.find('mutedSuccess', member.id));
  }

  /**
   * Mute command
   * @param user
   * @param interaction
   */
  @Slash('deafen', { description: 'Deafen a user' })
  async init(
    @SlashOption('user', {
      description: 'Who do you want to deafen?',
      required: true,
    })
    user: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const userId = user.replace(/\D/g, '');
    const { member, guild } = interaction;
    const members = await guild?.members.fetch();
    const target = members?.find((m) => m.id === userId);

    if (!target?.id) {
      return;
    }

    if (!target.voice.channel) {
      return;
    }

    if (target.user.id === member.user.id) {
      return;
    }

    await this.moderationService.setMute(target, true);
    const msg = this.createMessage(target);
    return interaction.reply({ embeds: [msg] });
  }
}

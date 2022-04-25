import { hasPermission } from 'Guards/has-permission';
import { moderationService } from 'Services/moderation.service';
import { Command } from 'Utils/command';
import { environment } from 'Utils/environment';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import { Discord, Permission, Slash, SlashOption } from 'discordx';

@Discord()
@Permission(false)
@Permission({
  id: environment.ownerId,
  type: 'USER',
  permission: true
})
@Permission(hasPermission(environment.moderatorRoles))
export abstract class Mute extends Command {
  constructor() {
    super();
  }

  /**
   * Create message
   * @param member
   */
  private createMessage(member: GuildMember): MessageEmbed {
    return new MessageEmbed()
      .setColor(member.displayHexColor)
      .setDescription(this.c('undeafenSuccess', member.id));
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
      await interaction.reply(this.c('noUser'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    if (!target.voice.channel) {
      await interaction.reply(this.c('notInVoiceChannel'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    await moderationService.setDeaf(target, false);
    const msg = this.createMessage(target);
    return interaction.reply({ embeds: [msg] });
  }
}

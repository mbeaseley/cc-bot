import { moderationService } from 'Services/moderation.service';
import { Command } from 'Utils/command';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';

@Discord()
export abstract class Unmute extends Command {
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
      .setDescription(this.c('unmutedSuccess', member.id));
  }

  /**
   * Mute command
   * @param user
   * @param interaction
   */
  @Slash('unmute', {
    description: 'Unmute a user!'
  })
  async init(
    @SlashOption('user', {
      description: 'Who do you want to unmute?'
    })
    user: string,
    interaction: CommandInteraction
  ): Promise<void> {
    try {
      const userId = user.replace(/\D/g, '');
      const { guild } = interaction;
      const members = await guild?.members.fetch();

      const target = members?.find((m) => m.id === userId);

      if (!target?.id) {
        await interaction.reply(this.c('noUser'));
        throw new Error();
      }

      if (!target.voice.channel) {
        await interaction.reply(this.c('notInVoiceChannel'));
        throw new Error();
      }

      await moderationService.setMute(target, false);
      const msg = this.createMessage(target);
      return interaction.reply({ embeds: [msg] });
    } catch (e: unknown) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }
  }
}

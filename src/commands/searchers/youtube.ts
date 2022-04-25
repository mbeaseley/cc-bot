import { hasPermission } from 'Guards/has-permission';
import { YoutubeService } from 'Services/youtube.service';
import { Command } from 'Utils/command';
import { environment } from 'Utils/environment';
import { CommandInteraction } from 'discord.js';
import { Discord, Permission, Slash, SlashOption } from 'discordx';

@Discord()
@Permission(false)
@Permission({
  id: environment.ownerId,
  type: 'USER',
  permission: true
})
@Permission(hasPermission(environment.moderatorRoles))
export abstract class Youtube extends Command {
  private youtubeService: YoutubeService;

  constructor() {
    super();
    this.youtubeService = new YoutubeService();
  }

  @Slash('add-youtube', {
    description: `Add youtube channel to video check list`
  })
  async init(
    @SlashOption('id', {
      description: 'Channel Id you want to add'
    })
    id: string,
    interaction: CommandInteraction
  ): Promise<void> {
    try {
      await this.youtubeService.addChannelToWatch(id);
      await interaction.reply(this.c('youtubeSuccess'));
    } catch (e: unknown) {
      await interaction.reply(this.c('youtubeError'));
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
    return interaction.deleteReply();
  }
}

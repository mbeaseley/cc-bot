import { hasPermission } from 'Guards/has-permission';
import { YoutubeService } from 'Services/youtube.service';
import { environment } from 'Utils/environment';
import Translate from 'Utils/translate';
import { CommandInteraction } from 'discord.js';
import { Discord, Permission, Slash, SlashOption } from 'discordx';

@Discord()
@Permission(false)
@Permission(hasPermission(environment.moderatorRoles))
export abstract class Youtube {
  private youtubeService: YoutubeService;

  constructor() {
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
      await interaction.reply(Translate.find('youtubeSuccess'));
    } catch (e: unknown) {
      await interaction.reply(Translate.find('youtubeError'));
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
    return interaction.deleteReply();
  }
}

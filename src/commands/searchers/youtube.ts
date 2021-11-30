import { CommandInteraction } from 'discord.js';
import { Discord, Permission, Slash, SlashOption } from 'discordx';
import { YoutubeService } from 'Services/youtube.service';
import { environment } from 'Utils/environment';
import Translate from 'Utils/translate';

@Discord()
@Permission(false)
@Permission({
  id: environment.moderatorRoles[0],
  type: 'ROLE',
  permission: true,
})
export abstract class Youtube {
  private youtubeService: YoutubeService;

  constructor() {
    this.youtubeService = new YoutubeService();
  }

  @Slash('add-youtube', {
    description: `Add youtube channel to video check list`,
  })
  async init(
    @SlashOption('id', {
      description: 'Channel Id you want to add',
      required: true,
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

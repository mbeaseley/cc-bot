import { Command } from 'Root/utils/command';
import { steamService } from 'Services/steam.service';
import { PlayerSummary, UserBans } from 'Types/steam';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';

@Discord()
export abstract class Steam extends Command {
  constructor() {
    super();
  }

  /**
   * Create Embed Message
   * @param playerSummary
   * @param userBans
   * @returns MessageEmbed
   */
  private createMessage(playerSummary: PlayerSummary, userBans: UserBans): MessageEmbed {
    return new MessageEmbed()
      .setColor(0x0099ff)
      .setAuthor({ name: this.c('steamAuthor'), iconURL: playerSummary?.avatarFull })
      .setTitle(playerSummary.name ?? '~')
      .setURL(playerSummary?.profileUrl ?? '')
      .setThumbnail(playerSummary.avatarFull)
      .setDescription(
        this.c(
          'steamDes',
          playerSummary.realName ?? '~',
          playerSummary.nameState ?? '~',
          playerSummary.location?.cityName ?? '~',
          playerSummary.location?.countryCode ?? '~',
          playerSummary.timeCreated?.format('DD/MM/YYYY') ?? '~',
          userBans.numberOfVACBans.toString() ?? '~',
          userBans.numberOfGameBans.toString() ?? '~',
          playerSummary.profileUrl as string
        )
      )
      .setTimestamp();
  }

  @Slash('steam', {
    description: 'searcher command to check and share your profile with friends on steam.'
  })
  async init(
    @SlashOption('name', {
      description: 'Vanity Url?'
    })
    url: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const user = await steamService.getVanityUser(url);

    if (!user.steamId) {
      await interaction.reply(this.c('steamNoUser'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const playerSummary = await steamService.getPlayerSummary(user.steamId);
    const userBans = await steamService.getUserBans(user.steamId);

    const msg = this.createMessage(playerSummary, userBans);
    return interaction.reply({ embeds: [msg] });
  }
}

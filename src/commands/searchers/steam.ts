import { SteamService } from 'Services/steam.service';
import { PlayerSummary, UserBans } from 'Types/steam';
import Translate from 'Utils/translate';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';

@Discord()
export abstract class Steam {
  private steamService: SteamService;

  constructor() {
    this.steamService = new SteamService();
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
      .setAuthor(Translate.find('steamAuthor'), playerSummary?.avatarFull)
      .setTitle(playerSummary.name ?? '~')
      .setURL(playerSummary?.profileUrl ?? '')
      .setThumbnail(playerSummary.avatarFull)
      .setDescription(
        Translate.find(
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
    description: 'Check and share your profile with friends on steam.'
  })
  async init(
    @SlashOption('name', {
      description: 'Vanity Url?'
    })
    url: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const user = await this.steamService.getVanityUser(url);

    if (!user.steamId) {
      await interaction.reply('**No valid steam vanity url was given!**');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const playerSummary = await this.steamService.getPlayerSummary(user.steamId);
    const userBans = await this.steamService.getUserBans(user.steamId);

    const msg = this.createMessage(playerSummary, userBans);
    return interaction.reply({ embeds: [msg] });
  }
}

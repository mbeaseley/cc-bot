import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash } from 'discordx';
import { KillerBuild, KillerItem } from '../../../types/dbd';
import { DBDService } from '../../../services/dbd.service';
import Utility from '../../../utils/utility';
import Translate from '../../../utils/translate';

const DEFAULTKILLERS: number[] = [1, 2, 3, 4, 7, 8];

@Discord()
export abstract class Killer {
  private dbdService: DBDService;

  constructor() {
    this.dbdService = new DBDService();
  }

  /**
   * Creates random killer build
   * @param authorId
   * @returns Promise<KillerBuild>
   */
  private async createKillerBuild(authorId: string): Promise<KillerBuild> {
    const killerBuild = new KillerBuild();

    // Killer
    const playerKillers = await this.dbdService.getPlayerKillers();
    const availableKillers =
      playerKillers.find((p) => p.userId === authorId)?.availableKiller ||
      DEFAULTKILLERS;

    const allKillers = await this.dbdService.getKillers();
    const killers = allKillers
      .map((k) => {
        return availableKillers.find((ak) => ak === k.id) ? k : undefined;
      })
      .filter(Boolean);

    const choosenKiller = Utility.random(killers) as KillerItem;
    killerBuild.killer = choosenKiller.name;
    killerBuild.image = choosenKiller.image;

    // Addons
    const addons = choosenKiller.addons?.slice();
    killerBuild.addons = Utility.random(addons || [], 2);

    // Offering
    const killerOffering = await this.dbdService.getKillerOfferings();
    killerBuild.offering = [Utility.random(killerOffering)];

    // Perks
    const killerPerks = await this.dbdService.getKillerPerks();
    killerBuild.perks = Utility.random(killerPerks, 4);

    return Promise.resolve(killerBuild);
  }

  /**
   * Create message
   * @param build
   * @returns MessageEmbed
   */
  private createMessage(build: KillerBuild): MessageEmbed {
    const { image, ...b } = { ...build };

    return Utility.createEmbedMessage(
      b,
      Translate.find('dbdKillerTitle'),
      build.image
    );
  }

  /**
   * DBD killer commmand
   * @param interaction
   */
  @Slash('dbd-killer', {
    description: 'Get a random dbd killer build\nCommand: /dbd-killer',
  })
  async init(interaction: CommandInteraction): Promise<void> {
    const build = await this.createKillerBuild(interaction.member.user.id);

    let users = await interaction.guild?.members.fetch();
    let user = users?.find((u) => u.id === interaction.member.user.id);

    const msg = this.createMessage(build);

    const dmChannel = await user?.createDM(true);
    await dmChannel?.send({ embeds: [msg] });

    await interaction.reply('**Killer build sent!**');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return interaction.deleteReply();
  }
}

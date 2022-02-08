import { DBDService } from 'Services/dbd.service';
import { SurviverBuild } from 'Types/dbd';
import Translate from 'Utils/translate';
import Utility from 'Utils/utility';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash } from 'discordx';

@Discord()
export abstract class Surviver {
  private dbdService: DBDService;

  constructor() {
    this.dbdService = new DBDService();
  }

  /**
   * Creates random surviver build
   */
  private async createSurviverBuild(): Promise<SurviverBuild> {
    const build = new SurviverBuild();

    // Perks
    const perks = await this.dbdService.getSurvivorPerks();
    build.perks = Utility.random(perks, 4);

    // offering
    const offerings = await this.dbdService.getSurvivorOfferings();
    build.offering = [Utility.random(offerings)];

    // loot
    const loot = await this.dbdService.getSurvivorLoot();
    build.loot = [Utility.random(loot)];

    // Loot Addon
    build.lootAddons = Utility.random(build.loot[0]?.addons, 2);

    return Promise.resolve(build);
  }

  /**
   * Create message
   * @param build
   * @returns MessageEmbed
   */
  private createMessage(build: SurviverBuild): MessageEmbed {
    return Utility.createEmbedMessage(build, Translate.find('dbdSurviverTitle'));
  }

  /**
   * DBD surviver commmand
   * @param interaction
   */
  @Slash('dbd-surviver', {
    description: 'Get a random dbd surviver build.'
  })
  async init(interaction: CommandInteraction): Promise<void> {
    const build = await this.createSurviverBuild();

    const users = await interaction.guild?.members.fetch();
    const user = users?.find((u) => u.id === interaction.member?.user.id);

    const msg = this.createMessage(build);

    const dmChannel = await user?.createDM(true);
    await dmChannel?.send({ embeds: [msg] });

    await interaction.reply('**Surviver build sent!**');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return interaction.deleteReply();
  }
}

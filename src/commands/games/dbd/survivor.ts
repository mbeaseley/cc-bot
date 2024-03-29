import { dbdService } from 'Services/dbd.service';
import { SurviverBuild } from 'Types/dbd';
import { Command } from 'Utils/command';
import Utility from 'Utils/utility';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash, SlashGroup } from 'discordx';

@Discord()
@SlashGroup({ name: 'dbd', description: 'Dead By Daylight Commands' })
@SlashGroup('dbd')
export abstract class Surviver extends Command {
  constructor() {
    super();
  }

  /**
   * Creates random surviver build
   */
  private async createSurviverBuild(): Promise<SurviverBuild> {
    const build = new SurviverBuild();

    // Perks
    const perks = await dbdService.getSurvivorPerks();
    build.perks = Utility.random(perks, 4);

    // offering
    const offerings = await dbdService.getSurvivorOfferings();
    build.offering = [Utility.random(offerings)];

    // loot
    const loot = await dbdService.getSurvivorLoot();
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
    return new MessageEmbed()
      .setColor(10181046)
      .setTitle(this.c('dbdSurviverTitle'))
      .addField(this.c('dbdLoot'), build.loot?.map((l) => l.getOneLine()).join('\n') ?? '~', false)
      .addField(
        this.c('dbdLookAddon'),
        build.lootAddons?.map((l) => l.getOneLine()).join('\n') ?? '~',
        false
      )
      .addField(
        this.c('dbdOffering'),
        build.offering?.map((o) => o.getOneLine()).join('\n') ?? '~',
        false
      )
      .addField(this.c('dbdPerk'), build.perks?.join('\n') ?? '~', false);
  }

  /**
   * DBD survivor commmand
   * @param interaction
   */
  @Slash('survivor', {
    description: 'Dead By Daylight command for getting a random dbd survivor build.'
  })
  async init(interaction: CommandInteraction): Promise<void> {
    const build = await this.createSurviverBuild();

    const users = await interaction.guild?.members.fetch();
    const user = users?.find((u) => u.id === interaction.member?.user.id);

    if (!user) {
      await interaction.reply(this.c('dbdNoMember'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const msg = this.createMessage(build);

    const dmChannel = await user.createDM(true);
    await dmChannel.send({ embeds: [msg] });

    await interaction.reply(this.c('dbdSurviverSent'));
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return interaction.deleteReply();
  }
}

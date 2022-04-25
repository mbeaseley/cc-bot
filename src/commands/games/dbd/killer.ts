import { dbdService } from 'Services/dbd.service';
import { KillerBuild, KillerItem } from 'Types/dbd';
import { Command } from 'Utils/command';
import Utility from 'Utils/utility';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash, SlashGroup } from 'discordx';

const DEFAULTKILLERS: number[] = [1, 2, 3, 4, 7, 8];

@Discord()
@SlashGroup({ name: 'dbd', description: 'Dead By Daylight Commands' })
@SlashGroup('dbd')
export abstract class Killer extends Command {
  constructor() {
    super();
  }

  /**
   * Creates random killer build
   * @param authorId
   * @returns Promise<KillerBuild>
   */
  private async createKillerBuild(authorId: string): Promise<KillerBuild> {
    const killerBuild = new KillerBuild();

    // Killer
    const playerKillers = await dbdService.getPlayerKillers();
    const availableKillers =
      playerKillers.find((p) => p.userId === authorId)?.availableKiller || DEFAULTKILLERS;

    const allKillers = await dbdService.getKillers();
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
    const killerOffering = await dbdService.getKillerOfferings();
    killerBuild.offering = [Utility.random(killerOffering)];

    // Perks
    const killerPerks = await dbdService.getKillerPerks();
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
    const msg = new MessageEmbed()
      .setColor(10181046)
      .setTitle(this.c('dbdKillerTitle'))
      .addField(this.c('dbdKiller'), b.killer ?? '~', false)
      .addField(this.c('dbdAddon'), b.addons?.map((a) => a.getOneLine()).join('\n') ?? '~', false)
      .addField(
        this.c('dbdOffering'),
        b.offering?.map((a) => a.getOneLine()).join('\n') ?? '~',
        false
      )
      .addField(this.c('dbdPerk'), b.perks?.join('\n') ?? '~', false);

    if (image) {
      msg.setThumbnail(image);
    }

    return msg;
  }

  /**
   * DBD killer commmand
   * @param interaction
   */
  @Slash('killer', {
    description: 'Get a random dbd killer build.'
  })
  async init(interaction: CommandInteraction): Promise<void> {
    if (!interaction.member) {
      await interaction.reply(this.c('dbdNoMember'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const build = await this.createKillerBuild(interaction.member.user.id);

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

    await interaction.reply(this.c('dbdKillerSent'));
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return interaction.deleteReply();
  }
}

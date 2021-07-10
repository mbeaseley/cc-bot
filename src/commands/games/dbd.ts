import { Command, CommandMessage, Description } from '@typeit/discord';
import { Message, MessageEmbed } from 'discord.js';
import { commands } from 'Data/dbdCommands';
import { DBDService } from 'Services/dbd.service';
import { KillerBuild, KillerItem, SurviverBuild } from 'Types/dbd';
import { environment } from 'Utils/environment';
import Utility from 'Utils/utility';

const DEFAULTKILLERS: number[] = [1, 2, 3, 4, 7, 8];

export class Dbd {
  dbdService: DBDService;
  killerBuild: KillerBuild = new KillerBuild();
  surviverBuild: SurviverBuild = new SurviverBuild();

  constructor() {
    this.dbdService = new DBDService();
  }

  /**
   * Creates random killer build
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
   * Creates random surviver build
   */
  private async createSurviverBuild(): Promise<SurviverBuild> {
    const surviverBuild = new SurviverBuild();

    // Perks
    const perks = await this.dbdService.getSurvivorPerks();
    surviverBuild.perks = Utility.random(perks, 4);

    // offering
    const offerings = await this.dbdService.getSurvivorOfferings();
    surviverBuild.offering = [Utility.random(offerings)];

    // loot
    const loot = await this.dbdService.getSurvivorLoot();
    surviverBuild.loot = [Utility.random(loot)];

    // Loot Addon
    surviverBuild.lootAddons = Utility.random(surviverBuild.loot[0]?.addons, 2);

    return Promise.resolve(surviverBuild);
  }

  /**
   * Handles and sends message
   * @param command
   * @param build
   */
  private async sendMessage(
    command: CommandMessage,
    build: KillerBuild | SurviverBuild
  ): Promise<Message | void> {
    if (command.deletable) await command.delete();

    const dbdBuild =
      build instanceof KillerBuild
        ? (build as KillerBuild)
        : (build as SurviverBuild);

    const title = `DBD Random ${
      build instanceof KillerBuild ? 'Killer' : 'Surviver'
    }`;
    const thumbnail =
      dbdBuild instanceof KillerBuild ? dbdBuild.image : undefined;
    const embed = Utility.createEmbedMessage(dbdBuild, title, thumbnail, [
      'image',
    ]);
    return command.author.send({
      embed,
    });
  }

  /**
   * Handles independent help info
   * @param command
   */
  private async createHelpMessage(
    command: CommandMessage
  ): Promise<Message | void> {
    if (command.deletable) await command.delete();

    const filterCommands = commands.filter((c) =>
      c.tag.find((t) => t !== 'help')
    );

    const fields = filterCommands.map((c) => {
      return {
        name: `**${c.description}**`,
        value: `\`@${environment.botName} dbd ${c.name}\``,
      };
    });

    const message = new MessageEmbed()
      .setColor(10181046)
      .setAuthor(
        `${command?.client?.user?.username} DBD Plugin Commands`,
        command?.client?.user?.displayAvatarURL()
      )
      .setThumbnail(environment.botThumbnail || '')
      .addFields([...fields]);

    return command.channel.send(message);
  }

  /**
   * Init
   * @param command
   */
  private async handleDbdCommand(
    command: CommandMessage
  ): Promise<Message | void> {
    try {
      const commandArray = Utility.getOptionFromCommand(command.content, 2);
      const keyCommand = commandArray?.[commandArray.length - 1].toLowerCase();

      const kllerCommands = commands.filter((c) =>
        c.tag.find((t) => t === 'killer')
      );
      const surviverCommands = commands.filter((c) =>
        c.tag.find((t) => t === 'surviver')
      );
      const helpCommands = commands.filter((c) =>
        c.tag.find((t) => t === 'help')
      );

      if (kllerCommands.find((c) => c.name === keyCommand)) {
        this.killerBuild = new KillerBuild();
        this.killerBuild = await this.createKillerBuild(command.author.id);

        return this.sendMessage(command, this.killerBuild);
      }

      if (surviverCommands.find((c) => c.name === keyCommand)) {
        this.surviverBuild = new SurviverBuild();
        this.surviverBuild = await this.createSurviverBuild();

        return this.sendMessage(command, this.surviverBuild);
      }

      if (helpCommands.find((c) => c.name === keyCommand)) {
        return this.createHelpMessage(command);
      } else {
        if (command.deletable) await command.delete();
        return command.reply(environment.commandNotFound);
      }
    } catch (e: unknown) {
      return Promise.reject();
    }
  }

  /**
   * @name dbdInit
   * @param command
   * @description Custom dbd commands
   * @returns
   */
  @Command('dbd')
  @Description('Dbd (dbd help for all possible commands)')
  async dbdInit(command: CommandMessage): Promise<Message | void> {
    return this.handleDbdCommand(command).catch(() => {
      return command.reply(environment.error);
    });
  }
}

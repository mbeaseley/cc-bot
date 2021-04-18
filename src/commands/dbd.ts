import { CommandMessage } from '@typeit/discord';
import { Message } from 'discord.js';
import { commands } from '../data/dbdCommands';
import { killer, killerOffering, killerPerks } from '../data/killer';
import { defaultKillers, playerKillers } from '../data/playerKillers';
import {
  surviverLoot,
  surviverOffering,
  surviverPerks,
} from '../data/surviver';
import {
  KillerBuild,
  KillerItem,
  SurviverBuild,
  SurvivorLoot,
} from '../types/dbd';
import * as environment from '../utils/environment';
import Utility from '../utils/utility';

export class Dbd {
  killerBuild: KillerBuild = new KillerBuild();
  surviverBuild: SurviverBuild = new SurviverBuild();

  private commandNotFoundMessage = `TRY AGAIN! YOU DIDN'T DO IT RIGHT!`;

  /**
   * Creates random killer build
   */
  private createKillerBuild(authorId: string): KillerBuild {
    const killerBuild = new KillerBuild();

    // Killer
    const availableKillers =
      playerKillers.find((p) => p.userId === authorId)?.availableKiller ||
      defaultKillers;

    const killers = killer
      .map((k) => {
        if (availableKillers.find((ak) => ak === k.id)) {
          return k;
        }
      })
      .filter(Boolean);

    const choosenKiller: KillerItem = Utility.random(killers);
    killerBuild.killer = choosenKiller.name;
    killerBuild.image = choosenKiller.image;

    // Addons
    const addons = choosenKiller.addons?.slice();
    killerBuild.addons = Utility.random(addons || [], 2);

    // Offering
    killerBuild.offering = [Utility.random(killerOffering)];

    // Perks
    killerBuild.perks = Utility.random(killerPerks, 4);

    return killerBuild;
  }

  /**
   * Creates random surviver build
   */
  private createSurviverBuild(): SurviverBuild {
    const surviverBuild = new SurviverBuild();

    // Perks
    surviverBuild.perks = Utility.random(surviverPerks, 4);

    // offering
    surviverBuild.offering = [Utility.random(surviverOffering)];

    // loot
    const loot: SurvivorLoot = Utility.random(surviverLoot);
    surviverBuild.loot = [loot];

    // Loot Addon
    surviverBuild.lootAddons = Utility.random(loot.addons, 2);

    return surviverBuild;
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
    await command.delete();

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
    await command.delete();

    const filterCommands = commands.filter((c) =>
      c.tag.find((t) => t !== 'help')
    );

    const fields = filterCommands.map((c) => {
      return {
        name: `**${c.description}**`,
        value: `\`@${environment.default.botName} dbd ${c.name}\``,
      };
    });

    return command.channel.send({
      embed: {
        color: 10181046,
        author: {
          name: `${command?.client?.user?.username} DBD Plugin Commands`,
          icon_url: command?.client?.user?.displayAvatarURL(),
        },
        fields,
      },
    });
  }

  /**
   * Init
   * @param command
   */
  public async init(command: CommandMessage): Promise<Message | void> {
    try {
      const commandArray = command.content.split(' ');
      const keyCommand = commandArray[commandArray.length - 1].toLowerCase();

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
        this.killerBuild = this.createKillerBuild(command.author.id);

        return this.sendMessage(command, this.killerBuild);
      }

      if (surviverCommands.find((c) => c.name === keyCommand)) {
        this.surviverBuild = new SurviverBuild();
        this.surviverBuild = this.createSurviverBuild();

        return this.sendMessage(command, this.surviverBuild);
      }

      if (helpCommands.find((c) => c.name === keyCommand)) {
        return this.createHelpMessage(command);
      } else {
        command.delete();
        return command.reply(this.commandNotFoundMessage);
      }
    } catch (e) {
      return Promise.reject();
    }
  }
}

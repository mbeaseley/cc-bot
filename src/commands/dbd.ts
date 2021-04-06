import { CommandMessage } from '@typeit/discord';
import { Message } from 'discord.js';
import { commands } from '../data/dbdCommands';
import {
  killer,
  KillerItem,
  killerOffering,
  killerPerks,
} from '../data/killer';
import {
  surviverLoot,
  surviverOffering,
  surviverPerks,
} from '../data/surviver';
import { KillerBuild, SurviverBuild } from '../types/dbd';
import Utility from '../utils/utility';

export class Dbd {
  killerBuild: KillerBuild = new KillerBuild();
  surviverBuild: SurviverBuild = new SurviverBuild();

  /**
   * Creates random killer build
   */
  private createKillerBuild(): KillerBuild {
    const killerBuild = new KillerBuild();

    // Killer
    const choosenKiller: KillerItem = Utility.random(killer);
    killerBuild.killer = choosenKiller.name;
    killerBuild.image = choosenKiller.image;

    // Addons
    const addons = choosenKiller.addons?.slice();
    killerBuild.addons = Utility.random(addons || [], 2);

    // Offering
    killerBuild.offering = Utility.random(killerOffering);

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
    surviverBuild.offering = Utility.random(surviverOffering);

    // loot
    surviverBuild.loot = Utility.random(surviverLoot);

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
        value: `\`@CC Bot dbd ${c.name}\``,
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
      this.killerBuild = this.createKillerBuild();

      return this.sendMessage(command, this.killerBuild);
    }

    if (surviverCommands.find((c) => c.name === keyCommand)) {
      this.surviverBuild = new SurviverBuild();
      this.surviverBuild = this.createSurviverBuild();

      return this.sendMessage(command, this.surviverBuild);
    }

    if (helpCommands.find((c) => c.name === keyCommand)) {
      return this.createHelpMessage(command);
    }

    return Promise.reject();
  }
}

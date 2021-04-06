import { CommandMessage } from '@typeit/discord';
import { Message } from 'discord.js';
import _ = require('underscore');
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

class KillerBuild {
  killer: string | undefined;
  image: string | undefined;
  addons: string[] | undefined = [];
  offering: string | undefined;
  perks: string[] | undefined = [];
}

class SurviverBuild {
  perks: string[] | undefined = [];
  loot: string | undefined;
  offering: string | undefined;
}

export class Dbd {
  killerBuild: KillerBuild = new KillerBuild();
  surviverBuild: SurviverBuild = new SurviverBuild();

  /**
   * Creates random killer build
   */
  private createKillerBuild(): KillerBuild {
    const killerBuild = new KillerBuild();

    // Killer
    const choosenKiller: KillerItem =
      killer[Math.floor(Math.random() * killer.length)];
    killerBuild.killer = choosenKiller.name;
    killerBuild.image = choosenKiller.image;

    // Addons
    const addons = choosenKiller.addons?.slice();
    killerBuild.addons = _.sample(addons || [], 2);

    // Offering
    killerBuild.offering =
      killerOffering[Math.floor(Math.random() * killerOffering.length)];

    // Perks
    killerBuild.perks = _.sample(killerPerks || [], 4);

    return killerBuild;
  }

  /**
   * Creates random surviver build
   */
  private createSurviverBuild(): SurviverBuild {
    const surviverBuild = new SurviverBuild();

    // Perks
    surviverBuild.perks = _.sample(surviverPerks, 4);

    // offering
    surviverBuild.offering =
      surviverOffering[Math.floor(Math.random() * surviverOffering.length)];

    // loot
    surviverBuild.loot =
      surviverLoot[Math.floor(Math.random() * surviverLoot.length)];

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

    const fields: { name: string; value: string }[] = [];
    Object.entries(dbdBuild).forEach(([key, value]) => {
      if (key === 'image') return;
      const field = {
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: typeof value !== 'string' ? value.join('\n') : value,
      };

      fields.push(field);
    });
    const thumbnail: { url: string | undefined } | undefined =
      dbdBuild instanceof KillerBuild ? { url: dbdBuild.image } : undefined;

    return command.author.send({
      embed: {
        title: `DBD Random ${
          build instanceof KillerBuild ? 'Killer' : 'Surviver'
        }`,
        color: 10181046,
        thumbnail,
        fields,
      },
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

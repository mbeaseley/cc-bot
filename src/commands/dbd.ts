import { CommandMessage } from '@typeit/discord';
import { Message } from 'discord.js';
import _ = require('underscore');
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

const KILLER_COMMANDS = ['killer', 'k'];
const SURIVER_COMMANDS = ['surviver', 's'];

class KillerBuild {
  name: string | undefined;
  addons: string[] | undefined = [];
  offering: string | undefined;
  perks: string[] | undefined = [];
}

class SurviverBuild {
  perks: string[] | undefined;
  loot: string | undefined;
  offering: string | undefined;
}

export class Dbd {
  killerBuild: KillerBuild = new KillerBuild();
  surviverBuild: SurviverBuild = new SurviverBuild();

  private createKillerBuild(): KillerBuild {
    const killerBuild = new KillerBuild();

    // Killer
    const choosenKiller: KillerItem =
      killer[Math.floor(Math.random() * killer.length)];
    killerBuild.name = choosenKiller.name;

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

  private async sendMessage(
    command: CommandMessage,
    build: KillerBuild | SurviverBuild
  ): Promise<Message | void> {
    await command.delete();
    return command.author.send(JSON.stringify(build));
  }

  /**
   * Init
   * @param command
   */
  public async init(command: CommandMessage): Promise<Message | void> {
    const commandArray = command.content.split(' ');
    const keyCommand = commandArray[commandArray.length - 1].toLowerCase();

    if (KILLER_COMMANDS.find((c) => c === keyCommand)) {
      this.killerBuild = new KillerBuild();
      this.killerBuild = this.createKillerBuild();

      return this.sendMessage(command, this.killerBuild);
    }

    if (SURIVER_COMMANDS.find((c) => c === keyCommand)) {
      this.surviverBuild = new SurviverBuild();
      this.surviverBuild = this.createSurviverBuild();

      return this.sendMessage(command, this.surviverBuild);
    }

    return Promise.reject();
  }
}

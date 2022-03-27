/*============
Player Available killers
=============*/
export class PlayerKiller {
  userId: string | undefined;
  availableKiller: number[];

  constructor(userId?: string, availableKillers?: number[]) {
    this.userId = userId;
    this.availableKiller = availableKillers ?? [];
  }
}

/*============
Killer Types
=============*/

export class KillerBuild {
  killer: string | undefined;
  image: string | undefined;
  addons: KillerAddon[] | undefined;
  offering: KillerOffering[] | undefined;
  perks: string[] | undefined;

  constructor(
    killer?: string,
    image?: string,
    addons?: KillerAddon[],
    offering?: KillerOffering[],
    perks?: string[]
  ) {
    this.killer = killer;
    this.addons = addons;
    this.offering = offering;
    this.perks = perks;
    this.image = image;
  }
}

export class KillerAddon {
  name: string | undefined;
  rarity: string | undefined;

  constructor(name?: string, rarity?: string) {
    this.name = name;
    this.rarity = rarity;
  }

  /**
   * Get in one line
   * @returns string
   */
  getOneLine(): string {
    return `${this.name ?? '~'} (${this.rarity ?? '~'})`;
  }
}

export class KillerOffering extends KillerAddon {
  constructor(name?: string, rarity?: string) {
    super(name, rarity);
  }
}

export class KillerItem {
  id: number | undefined;
  name: string | undefined;
  image: string | undefined;
  addons: KillerAddon[] | undefined;

  constructor(id?: number, name?: string, image?: string) {
    this.id = id;
    this.name = name;
    this.image = image;
  }
}

/*=============
Survivor Types
==============*/

export class SurviverBuild {
  loot: SurvivorLoot[] | undefined;
  lootAddons: SurvivorAddon[] | undefined;
  offering: SurvivorOffering[] | undefined;
  perks: string[] | undefined;

  constructor(
    loot?: SurvivorLoot[],
    lootAddons?: SurvivorAddon[],
    offering?: SurvivorOffering[],
    perks?: string[]
  ) {
    this.loot = loot;
    this.lootAddons = lootAddons;
    this.offering = offering;
    this.perks = perks;
  }
}

export class SurvivorAddon {
  name: string | undefined;
  rarity: string | undefined;

  constructor(name?: string, rarity?: string) {
    this.name = name;
    this.rarity = rarity;
  }

  /**
   * Get in one line
   * @returns string
   */
  getOneLine(): string {
    return `${this.name ?? '~'} (${this.rarity ?? '~'})`;
  }
}

export class SurvivorLoot extends SurvivorAddon {
  addons: SurvivorAddon[] | [] = [];

  constructor(name?: string, rarity?: string) {
    super(name, rarity);
  }
}

export class SurvivorOffering extends SurvivorAddon {
  constructor(name?: string, rarity?: string) {
    super(name, rarity);
  }
}

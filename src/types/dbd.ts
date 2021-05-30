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

export class KillerOffering {
  name: string | undefined;
  rarity: string | undefined;

  constructor(name?: string, rarity?: string) {
    this.name = name;
    this.rarity = rarity;
  }
}

export class KillerAddon {
  name: string | undefined;
  rarity: string | undefined;

  constructor(name?: string, rarity?: string) {
    this.name = name;
    this.rarity = rarity;
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
}

export class SurvivorLoot {
  name: string | undefined;
  rarity: string | undefined;
  addons: SurvivorAddon[] | [] = [];

  constructor(name?: string, rarity?: string) {
    this.name = name;
    this.rarity = rarity;
  }
}

export class SurvivorOffering {
  name: string | undefined;
  rarity: string | undefined;

  constructor(name?: string, rarity?: string) {
    this.name = name;
    this.rarity = rarity;
  }
}

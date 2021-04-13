export class KillerBuild {
  killer: string | undefined;
  image: string | undefined;
  addons: string[] | undefined;
  offering: string | undefined;
  perks: string[] | undefined;

  constructor(
    killer?: string,
    image?: string,
    addons?: string[],
    offering?: string,
    perks?: string[]
  ) {
    this.killer = killer;
    this.addons = addons;
    this.offering = offering;
    this.perks = perks;
    this.image = image;
  }
}

export class SurviverBuild {
  loot: string | undefined;
  lootAddons: SurvivorAddon[] | undefined;
  offering: string | undefined;
  perks: string[] | undefined;

  constructor(
    loot?: string,
    lootAddons?: SurvivorAddon[],
    offering?: string,
    perks?: string[]
  ) {
    this.loot = loot;
    this.lootAddons = lootAddons;
    this.offering = offering;
    this.perks = perks;
  }
}

export class KillerItem {
  id: number | undefined;
  name: string | undefined;
  image: string | undefined;
  addons: string[] | undefined;
}

export class SurvivorAddon {
  name: string | undefined;
  rarity: string | undefined;
}

export class SurvivorLoot {
  name: string | undefined;
  rarity: string | undefined;
  addons: SurvivorAddon[] | [] = [];
}

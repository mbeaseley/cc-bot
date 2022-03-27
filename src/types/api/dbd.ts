/*============
Killer Types
=============*/

export interface ApiPlayerKillers {
  user_id: string;
  available_killers: number[];
}

export interface ApiKillers {
  id: number;
  name: string;
  image: string;
  addons: { name: string; rarity: string }[];
}

export interface ApiKillerPerk {
  perk: string;
}

export interface ApiKillerOffering {
  name: string;
  rarity: string;
}

/*=============
Survivor Types
==============*/

export interface ApiSurvivorPerk {
  perk: string;
}

export interface ApiSurvivorLoot {
  name: string;
  rarity: string;
  addons: { name: string; rarity: string }[];
}

export interface ApiSurvivorOffering {
  name: string;
  rarity: string;
}

/*=============
Challenges
==============*/

export interface ApiChallenge {
  challenge: string;
}

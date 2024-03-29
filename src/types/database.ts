export type Databases = {
  dbd: DBDCollections;
  emojis: EmojisCollections;
  rules: RulesCollection;
  servers: ServersCollection;
  twitch: TwitchCollection;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type StringOfLength<Min extends number, Max extends number> = string & {
  __value__: never;
};

export enum DBDCollections {
  killerOfferings = 'killer_offerings',
  killerPerks = 'killer_perks',
  killers = 'killers',
  playerKillers = 'player_killers',
  survivorLoots = 'survivor_loots',
  survivorOfferings = 'survivor_offerings',
  survivorPerks = 'survivor_perks',
  killerChallenges = 'killer_challenges',
  survivorChallenges = 'survivor_challenges'
}

export type EmojisCollections = StringOfLength<18, 18>;

export type RulesCollection = StringOfLength<18, 18>;

export enum ServersCollection {
  minecraft = 'minecraft',
  youtube = 'youtube'
}

export type TwitchCollection = StringOfLength<18, 18>;

export type DatabaseName = keyof Databases;

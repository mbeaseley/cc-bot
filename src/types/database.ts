export type Databases = {
  dbd: DBDCollections;
  emojis: EmojisCollections;
  rules: RulesCollection;
  servers: ServersCollection;
};

export enum DBDCollections {
  killerOfferings = 'killer_offerings',
  killerPerks = 'killer_perks',
  killers = 'killers',
  playerKillers = 'player_killers',
  survivorLoots = 'survivor_loots',
  survivorOfferings = 'survivor_offerings',
  survivorPerks = 'survivor_perks',
}

export enum EmojisCollections {
  actions = 'actions',
  roles = 'roles',
}

export enum RulesCollection {
  server = 'server',
}

export enum ServersCollection {
  minecraft = 'minecraft',
  youtube = 'youtube',
}

export type DatabaseName = keyof Databases;

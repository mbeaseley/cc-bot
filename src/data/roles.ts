interface Reaction {
  [key: string]: string;
}

export const reactionRoles: Reaction = {
  '🤖': 'Bot',
  yes: 'Member',
  live: 'Streamers',
  callofduty: 'Call of Duty',
  dbd: 'Dead By Daylight',
  person_rowing_boat: 'Sailors',
  valorant: 'Valorant',
  among_us: 'Among us',
  minecraft_block: 'Minecraft',
  fornite: 'Fortnite',
  EFT: 'Escape from Tarkov',
  horror: 'Horror',
  bro: 'Bros',
  shark_bait: 'SharkBait',
  poor_student: 'Poor Student',
};

export const reactionActions: Reaction = {
  '🚫': 'delete',
};

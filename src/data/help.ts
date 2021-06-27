export type CommandType = 'fun' | 'games' | 'admin' | 'searchers';
export interface CommandItem {
  name: string;
  description?: string;
  fullCommand: string;
  type: CommandType;
}

export const adminCommands = ['purge', 'question'];

export const commandOverrides: CommandItem[] = [
  {
    name: 'playerchoice',
    fullCommand:
      'playerchoice <...@user(optional)>\nExclude users example: @user @user (add after command name)',
    type: 'games',
  },
  {
    name: 'dbd',
    fullCommand: 'dbd',
    type: 'games',
  },
  {
    name: 'insult',
    fullCommand: 'insult <@user(optional)>',
    type: 'fun',
  },
  {
    name: 'compliment',
    fullCommand: 'compliment <@user(optional)>',
    type: 'fun',
  },
  {
    name: 'sayIt',
    fullCommand: 'sayIt <@user(optional)>',
    type: 'fun',
  },
  {
    name: 'poll',
    fullCommand: 'poll [question] [answer1] [answer2] ...',
    type: 'fun',
  },
  {
    name: 'joke',
    fullCommand: 'joke',
    type: 'fun',
  },
  {
    name: 'urban',
    description: 'Get urban definition of word',
    fullCommand: 'urban <word>',
    type: 'searchers',
  },
  {
    name: 'weather',
    description: 'Get the weather of your area',
    fullCommand: 'weather <area>',
    type: 'searchers',
  },
  {
    name: 'twitch',
    description: 'Find your favourites streamers',
    fullCommand: 'twitch <username>',
    type: 'searchers',
  },
  {
    name: 'steam',
    fullCommand: 'steam <vanity url name>',
    type: 'searchers',
  },
  {
    name: 'instagram',
    fullCommand: 'instagram <username>',
    type: 'searchers',
  },
  {
    name: 'minecraft',
    fullCommand: 'minecraft <ip(optional)>:<port(optional)>',
    type: 'searchers',
  },
  {
    name: 'set minecraft',
    fullCommand: 'set minecraft <ip>:<port(optional)>',
    type: 'searchers',
  },
  {
    name: 'question',
    fullCommand: `question <type>\nCurrent types: 'rules'`,
    type: 'admin',
  },
  {
    name: 'purge',
    fullCommand: 'purge <count>',
    type: 'admin',
  },
];

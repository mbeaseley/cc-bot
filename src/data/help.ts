export interface CommandItem {
  name: string;
  description: string;
  fullCommand: string;
  type: 'fun' | 'games' | 'admin' | 'searchers';
}

export const adminCommands = ['help', 'purge', 'question'];

export const commands: CommandItem[] = [
  {
    name: 'playerchoice',
    description: 'Chooses Player',
    fullCommand:
      'playerchoice <...@user(optional)>\nExclude users example: @user @user (add after command name)',
    type: 'games',
  },
  {
    name: 'dbd',
    description: 'Dbd (dbd help for all possible commands)',
    fullCommand: 'dbd',
    type: 'games',
  },
  {
    name: 'insult',
    description: 'Send a fun insult to yourself or a friend',
    fullCommand: 'insult <@user(optional)>',
    type: 'fun',
  },
  {
    name: 'compliment',
    description: 'Send a nice compliment to yourself or a friend',
    fullCommand: 'compliment <@user(optional)>',
    type: 'fun',
  },
  {
    name: 'sayit',
    description: 'flip a coin for a insult or compliment',
    fullCommand: 'sayIt <@user(optional)>',
    type: 'fun',
  },
  {
    name: 'poll',
    description: 'Get your questions answered!',
    fullCommand: 'poll [question] [answer1] [answer2] ...',
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
    description: 'Check and share your profile with friends on steam',
    fullCommand: 'steam <vanity url name>',
    type: 'searchers',
  },
  {
    name: 'instagram',
    description: 'Find someone you know on Instagram',
    fullCommand: 'instagram <username>',
    type: 'searchers',
  },
  {
    name: 'minecraft',
    description: 'Ping a minecraft server for information',
    fullCommand: 'minecraft <ip(optional)>:<port(optional)>',
    type: 'searchers',
  },
  {
    name: 'set minecraft',
    description: 'Set default IP and Port for server',
    fullCommand: 'set minecraft <ip>:<port(optional)>',
    type: 'searchers',
  },
];

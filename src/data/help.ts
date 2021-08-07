import { CommandItem } from 'Types/help';

export const commandHelpTypes: CommandItem[] = [
  {
    name: 'Fun',
    fullCommand: '@{botName} help fun',
  },
  {
    name: 'Games',
    fullCommand: '@{botName} help games',
  },
  {
    name: 'Searchers',
    fullCommand: '@{botName} help searchers',
  },
  {
    name: 'Music',
    fullCommand: '@{botName} help music',
    restrict: true,
  },
  {
    name: 'Admin',
    fullCommand: '@{botName} help admin',
    restrict: true,
  },
];

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
    fullCommand: 'joke <@user(optional)>',
    type: 'fun',
  },
  {
    name: 'advice',
    fullCommand: 'advice <@user(optional)>',
    type: 'fun',
  },
  {
    name: 'flip',
    fullCommand: 'flip',
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
    type: 'games',
  },
  {
    name: 'set minecraft',
    fullCommand: 'set minecraft <ip>:<port(optional)>',
    type: 'games',
  },
  {
    name: 'question',
    fullCommand: `question <type>\nCurrent types: 'rules', 'game roles'`,
    type: 'admin',
  },
  {
    name: 'purge',
    fullCommand: 'purge <count>',
    type: 'admin',
  },
  {
    name: 'welcome',
    fullCommand: 'welcome <@username1> <@username2(optional)>...',
    type: 'admin',
  },
  {
    name: 'join',
    fullCommand: 'join',
    type: 'music',
  },
  {
    name: 'dc',
    fullCommand: 'dc',
    type: 'music',
  },
  {
    name: 'meme',
    fullCommand: 'meme',
    type: 'fun',
  },
];

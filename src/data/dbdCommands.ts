class CommandItem {
  name: string | undefined;
  description: string | undefined;
  tag: string[] | [] = [];
}

export const commands: CommandItem[] = [
  {
    name: 'killer',
    description: 'Killer Build Command',
    tag: ['killer'],
  },
  {
    name: 'k',
    description: 'Killer Shorthand Build Command',
    tag: ['killer'],
  },
  {
    name: 'surviver',
    description: 'Surviver Build Command',
    tag: ['surviver'],
  },
  {
    name: 's',
    description: 'surviver Shorthand Build Command',
    tag: ['surviver'],
  },
  {
    name: 'help',
    description: 'Help Command',
    tag: ['help'],
  },
  {
    name: 'dbd',
    description: 'Help Command',
    tag: ['help'],
  },
];

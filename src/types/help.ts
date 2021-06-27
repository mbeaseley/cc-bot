export type CommandType = 'fun' | 'games' | 'admin' | 'searchers';

export interface CommandItem {
  name: string;
  description?: string;
  fullCommand: string;
  type: CommandType;
}

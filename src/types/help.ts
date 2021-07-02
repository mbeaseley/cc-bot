export type CommandType = 'fun' | 'games' | 'admin' | 'searchers' | 'music';

export interface CommandItem {
  name: string;
  description?: string;
  fullCommand: string;
  type?: CommandType;
  restrict?: boolean;
}

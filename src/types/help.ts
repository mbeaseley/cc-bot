export type CommandType =
  | 'fun'
  | 'games'
  | 'admin'
  | 'searchers'
  | 'music'
  | 'image'
  | 'other';

export interface CommandItem {
  name: string;
  description?: string;
  fullCommand: string;
  type?: CommandType;
  restrict?: boolean;
}

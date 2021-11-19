export interface Reaction {
  [key: string]: string;
  type: string;
}

export type ReactionActions = 'delete' | 'beam_up';

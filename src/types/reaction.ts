export interface Reaction {
  [key: string]: string;
  eventType: 'role' | 'action';
  roleType: string;
}

export type ReactionActions = 'delete' | 'beam_up';

export type ReactionRoleTypes = 'game' | 'device' | 'pronoun';

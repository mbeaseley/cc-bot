export interface Reaction {
  [key: string]: string;
  eventType: 'role' | 'action';
  roleType?: string | undefined;
}

export type ReactionActions = 'delete' | 'beam_up';

export type ReactionRoleTypes = 'game' | 'device' | 'pronoun';

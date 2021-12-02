export interface Reaction {
  [key: string]: string;
  type: string;
}

export type ReactionActions = 'delete' | 'beam_up';

export interface ApiEmojiRole {
  emoji_name: string;
  role_name: string;
  type: string;
}

export interface ApiReactionAction {
  emoji_name: string;
  action: string;
}

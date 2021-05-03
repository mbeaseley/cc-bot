interface Reaction {
  [key: string]: string;
}

export const reactionRoles: Reaction = {
  '✅': 'Member',
  '🤖': 'Bot',
};

export const reactionActions: Reaction = {
  '🚫': 'delete',
};

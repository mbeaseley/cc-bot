import { GuildEmoji } from 'discord.js';

export const rules = (e: GuildEmoji | undefined) => {
  return [
    '1) Do not **insult** or **personally attack anyone** :no_entry_sign:',
    '2) **Unironic racism/sexism will be punished**, there is a line between a joke and something serious.',
    '3) Do not discuss religion or politics. :no_entry_sign:',
    '4) No posting **porn, gore, or other explicit content**.',
    '5) No jokes about mental disabilities.',
    '6) **No racist, explicit, disrespectful, or offensive nicknames/profile pictures**. :no_entry_sign:',
    '7) Keep posts in correct channels. Don’t go wildly off topic in a chat',
    'Failure to adhere these rules and principles may result in a Kick/Ban',
    `**Verify that you have read and understand these rules by clicking the emoji <:${e?.name}:${e?.id}>  below**`,
  ];
};

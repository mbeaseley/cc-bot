require('dotenv').config({ path: `.env.${process.env.TS_NODE_DEV}` });

interface EnvironmentObject {
  token: string;
  botId: string;
  botName: string;
  admins: string[] | never[];
  server: string;
  error: string;
  commandNotFound: string;
  memberAdd: string;
  memberRemove: string;
}

export const environment = {
  token: process.env.TOKEN ?? '',
  botId: process.env.BOTID ?? '',
  botName: process.env.BOTNAME ?? '',
  admins: JSON.parse(process.env.ADMINS || ''),
  server: process.env.SERVER,
  error: 'I have failed you!',
  commandNotFound: `TRY AGAIN! YOU DIDN'T DO IT RIGHT!`,
  memberAdd: process.env.MEMBERADD ?? '',
  memberRemove: process.env.MEMBERREMOVE ?? '',
} as EnvironmentObject;

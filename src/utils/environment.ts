// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: `.env.${process.env.TS_NODE_DEV}` });

interface EnvironmentObject {
  token: string;
  botId: string;
  botName: string;
  admins: string[] | never[];
  error: string;
  commandNotFound: string;
}

export const environment = {
  token: process.env.TOKEN ?? '',
  botId: process.env.BOTID ?? '',
  botName: process.env.BOTNAME ?? '',
  admins: JSON.parse(process.env.ADMINS || ''),
  error: 'I have failed you!',
  commandNotFound: `TRY AGAIN! YOU DIDN'T DO IT RIGHT!`,
} as EnvironmentObject;

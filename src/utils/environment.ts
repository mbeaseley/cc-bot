require('dotenv').config({ path: `.env.${process.env.TS_NODE_DEV}` });

interface EnvironmentObject {
  token: string;
  botId: string;
  botName: string;
  botThumbnail: string;
  admins: string[] | never[];
  server: string;
  error: string;
  commandNotFound: string;
  memberAdd: string;
  memberRemove: string;
  emojiAcceptRules: {
    name: string;
  };
  dbUsername: string;
  dbPassword: string;
  weatherAppId: string;
  twitchClientId: string;
  twitchSecret: string;
  steamApiKey: string;
  commandBase: string;
  streamsBase: string;
}

export const environment = {
  token: process.env.TOKEN ?? '',
  botId: process.env.BOTID ?? '',
  botName: process.env.BOTNAME ?? '',
  botThumbnail: process.env.BOTTHUMBNAIL ?? '',
  admins: JSON.parse(process.env.ADMINS || ''),
  server: process.env.SERVER,
  error: 'I have failed you!',
  commandNotFound: `TRY AGAIN! YOU DIDN'T DO IT RIGHT!`,
  memberAdd: process.env.MEMBERADD ?? '',
  memberRemove: process.env.MEMBERREMOVE ?? '',
  emojiAcceptRules: {
    name: process.env.EMOJIACCEPTEDNAME,
  },
  dbUsername: process.env.DBUSERNAME,
  dbPassword: process.env.DBPASSWORD,
  weatherAppId: process.env.WEATHERAPPID,
  twitchClientId: process.env.TWITCHCLIENTID,
  twitchSecret: process.env.TWITCHSECRET,
  steamApiKey: process.env.STEAMAPIKEY,
  commandBase: process.env.COMMANDBASE,
  streamsBase: process.env.STREAMSBASE,
} as EnvironmentObject;

require('dotenv').config({ path: `.env` });

interface EnvironmentObject {
  token: string;
  botId: string;
  botName: string;
  botThumbnail: string;
  moderatorRoles: string[];
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
  eventChannelId: string;
  eventRoleId: string;
  eventIds: {
    category: string;
    channel: string;
    role: string;
  };
}

export const environment = {
  token: process.env.TOKEN ?? '',
  botId: process.env.BOTID ?? '',
  botName: process.env.BOTNAME ?? '',
  botThumbnail: process.env.BOTTHUMBNAIL ?? '',
  moderatorRoles: (process.env.MODROLES ?? '').split(' ') ?? [],
  server: process.env.SERVER,
  error: 'I have failed you!',
  commandNotFound: `TRY AGAIN! YOU DIDN'T DO IT RIGHT!`,
  memberAdd: process.env.MEMBERADD ?? '',
  memberRemove: process.env.MEMBERREMOVE ?? '',
  emojiAcceptRules: {
    name: process.env.EMOJIACCEPTEDNAME
  },
  dbUsername: process.env.DBUSERNAME,
  dbPassword: process.env.DBPASSWORD,
  weatherAppId: process.env.WEATHERAPPID,
  twitchClientId: process.env.TWITCHCLIENTID,
  twitchSecret: process.env.TWITCHSECRET,
  steamApiKey: process.env.STEAMAPIKEY,
  commandBase: process.env.COMMANDBASE,
  streamsBase: process.env.STREAMSBASE,
  eventIds: {
    category: process.env.EVENTCATEGORYID,
    channel: process.env.EVENTCHANNELID,
    role: process.env.EVENTROLEID
  }
} as EnvironmentObject;

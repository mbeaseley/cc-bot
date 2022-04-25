import { Permission } from 'Types/permission';

require('dotenv').config({ path: `.env` });

interface EnvironmentObject {
  environment: 'development' | 'production';
  token: string;
  botId: string;
  serverId: string;
  ownerId: string;
  moderatorRoles: Permission[];
  server: string;
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
  eventIds: {
    category: string;
    channel: string;
    role: string;
  };
  feedbackChannel: string;
}

export const environment = {
  environment: process.env.NODE_ENV ?? 'production',
  token: process.env.TOKEN ?? '',
  botId: process.env.BOTID ?? '',
  serverId: process.env.SERVERID ?? '',
  ownerId: process.env.OWNERID ?? '',
  moderatorRoles: (process.env.MODROLES ?? '').split(' ').map((id) => {
    return new Permission(id, 'ROLE');
  }),
  server: process.env.SERVER,
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
  },
  feedbackChannel: process.env.FEEDBACKCHANNELID
} as EnvironmentObject;

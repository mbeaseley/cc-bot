interface EnvironmentObject {
  token: string;
  botId: string;
  botName: string;
  admins: string[] | never[];
}

export default {
  token: process.env.TOKEN ?? '',
  botId: process.env.BOTID ?? '',
  botName: process.env.BOTNAME ?? '',
  admins: JSON.parse(process.env.ADMINS || ''),
} as EnvironmentObject;

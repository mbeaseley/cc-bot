interface EnvironmentObject {
  token: string;
  botId: string;
  admins: string[] | never[];
}

export default {
  token: process.env.TOKEN ?? '',
  botId: process.env.BOTID ?? '',
  admins: JSON.parse(process.env.ADMINS || ''),
} as EnvironmentObject;

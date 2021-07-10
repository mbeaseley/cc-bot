import { GuardFunction } from '@typeit/discord';
import { environment } from 'Utils/environment';

export const isAdmin: GuardFunction<'message'> = async ([message], _, next) => {
  if (environment.admins.find((id) => id === message.author.id)) {
    await next();
  }
};

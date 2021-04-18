import { GuardFunction } from '@typeit/discord';
import { environment } from '../utils/environment';

export const isAdmin: GuardFunction<'message'> = async (
  [message],
  client,
  next
) => {
  if (environment.admins.find((id) => id === message.author.id)) {
    await next();
  }
};

import { GuardFunction } from '@typeit/discord';
import * as environment from '../utils/environment';

export const isAdmin: GuardFunction<'message'> = async (
  [message],
  client,
  next
) => {
  if (environment.default.admins.find((id) => id === message.author.id)) {
    await next();
  }
};

import { Permission } from 'Types/permission';
import { IPermissions } from 'discordx';

export const hasPermission = (items: Permission[]): IPermissions[] => {
  return items.map((p) => {
    return { id: p.id, type: p.type, permission: true };
  });
};

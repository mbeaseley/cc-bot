import { Permission } from 'Types/permission';
import { ApplicationCommandPermissions } from 'discord.js';

/**
 * Convert values into correct format
 * @param value
 * @returns ApplicationCommandPermissions[]
 */
export const hasPermission = (value: Permission[]): ApplicationCommandPermissions[] => {
  return value.map((v) => {
    return { id: v.id, permission: true, type: v.type };
  });
};

import { Collection, Guild, GuildMember, Role } from 'discord.js';

class RoleService {
  /**
   * Get all roles
   * @param guild
   * @returns Promise<Collection<string, Role>>
   */
  public async getAll(guild: Guild | null): Promise<Collection<string, Role> | void> {
    return guild ? guild?.roles.fetch() : Promise.resolve();
  }

  /**
   * Add role to target
   * @param target
   * @param role
   * @returns Promise<GuildMember>
   */
  public async add(target: GuildMember, role: Role): Promise<GuildMember> {
    return target.roles.add(role.id);
  }
}

export const roleService = new RoleService();

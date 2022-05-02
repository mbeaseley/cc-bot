import { roleService } from 'Services/roles.service';
import { Command } from 'Utils/command';
import { CommandInteraction, Guild, Role } from 'discord.js';
import { Discord, Slash, SlashGroup, SlashOption } from 'discordx';

@Discord()
@SlashGroup({ name: 'role', description: 'Manage roles' })
@SlashGroup('role')
export class Roles extends Command {
  /**
   * Find role within guild
   * @param guild
   * @param role
   * @returns Promise<Role | undefined>
   */
  private async findRole(guild: Guild | null, role: string): Promise<Role | undefined> {
    return await (await roleService.getAll(guild))?.find((r) => r.name === role || r.id === role);
  }

  @Slash('add', { description: 'moderator command to add role to user' })
  async addInit(
    @SlashOption('role', {
      description: 'Please add role name or id'
    })
    role: string,
    @SlashOption('user', { description: 'Please @username' })
    user: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const { guild } = interaction;

    const roleToAdd = await this.findRole(guild, role);

    if (!roleToAdd) {
      await interaction.reply(this.c('noRole'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const userId = user.replace(/\D/g, '');
    const members = await guild?.members.fetch();
    const target = members?.find((m) => m.id === userId);

    if (!target?.id) {
      await interaction.reply(this.c('noUser'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    try {
      await roleService.add(target, roleToAdd);
      await interaction.reply(
        this.c('roleAdded', roleToAdd.name, target.nickname ?? target.user.username)
      );
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    } catch (e: unknown) {
      await interaction.reply(this.c('noRoleAddedOrRemove'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }
  }

  @Slash('remove', { description: 'moderator command to remove role from user' })
  async removeInit(
    @SlashOption('role', {
      description: 'Please add role name or id'
    })
    role: string,
    @SlashOption('user', { description: 'Please @username' })
    user: string,
    interaction: CommandInteraction
  ): Promise<any> {
    const { guild } = interaction;

    const roleToRemove = await this.findRole(guild, role);

    if (!roleToRemove) {
      await interaction.reply(this.c('noRole'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const userId = user.replace(/\D/g, '');
    const members = await guild?.members.fetch();
    const target = members?.find((m) => m.id === userId);

    if (!target?.id) {
      await interaction.reply(this.c('noUser'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    try {
      await roleService.add(target, roleToRemove);
      await interaction.reply(
        this.c('roleRemove', roleToRemove.name, target.nickname ?? target.user.username)
      );
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    } catch (e: unknown) {
      await interaction.reply(this.c('noRoleAddedOrRemove'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }
  }
}

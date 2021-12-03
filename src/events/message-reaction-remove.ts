import { ReactionService } from 'Services/reaction.service';
import { Reaction } from 'Types/reaction';
import { environment } from 'Utils/environment';
import Utility from 'Utils/utility';
import { GuildMember, Role } from 'discord.js';
import { ArgsOf, Discord, On } from 'discordx';

@Discord()
export abstract class messageReactionRemove {
  private reactionService: ReactionService;

  constructor() {
    this.reactionService = new ReactionService();
  }

  /**
   * Get choosen role or action
   * @param reactions
   * @param emojiName
   * @returns string
   */
  private getChoosenRoleOrAction(reactions: Reaction[], emojiName: string): string {
    let choosenReaction = '';
    reactions.forEach((r) => {
      if (r[emojiName]) {
        choosenReaction = r[emojiName];
      }
    });

    return choosenReaction;
  }

  /**
   * Remove user roles
   * @param action
   * @param reaction
   * @param member
   * @param role
   * @returns void
   */
  private async removeRole(member: GuildMember, role: Role | undefined): Promise<void> {
    if (!role?.id) {
      return Promise.reject();
    }

    try {
      await member.roles.remove(role.id);
    } catch (e: unknown) {
      return Promise.resolve();
    }
  }

  /**
   * messageReactionAdd event
   * @param messageReaction
   * @param user
   * @returns
   */
  @On('messageReactionRemove')
  async init([messageReaction, user]: ArgsOf<'messageReactionRemove'>): Promise<any> {
    if (user.bot) {
      return Promise.resolve();
    }

    if (messageReaction.partial) {
      try {
        await messageReaction.fetch();
      } catch (e) {
        return Promise.resolve();
      }
    }

    const guild = Utility.getGuild(messageReaction.client.guilds);

    if (!guild?.id) {
      return Promise.resolve();
    }

    const reactionRoles = await this.reactionService.getReactionRoles();
    const member = await guild.members.fetch(user.id);
    const choosenRole = this.getChoosenRoleOrAction(
      reactionRoles,
      messageReaction.emoji?.name ?? ''
    );

    if (messageReaction.emoji.name === environment.emojiAcceptRules.name) {
      return Promise.resolve();
    }

    const role = guild.roles.cache.find((r) => r.name === choosenRole);

    if (role && messageReaction?.message?.author?.bot) {
      return this.removeRole(member, role);
    }
  }
}

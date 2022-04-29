import { Guild } from 'discord.js';
import { databaseService } from 'Services/database.service';
import { ApiEmojiRole, ApiReactionAction } from 'Types/api/reaction';
import { EmojisCollections } from 'Types/database';
import { Reaction } from 'Types/reaction';

export class ReactionModelService {
  private _roles: Reaction[] | undefined;
  private _actions: Reaction[] | undefined;

  /**
   * ==================================
   * Fetch Emoji Roles
   * ==================================
   */

  /**
   * Get Reaction Roles
   */
  private get reactionRoles() {
    return this._roles ?? [];
  }

  /**
   * Set Reaction Roles
   */
  private set reactionRoles(value: Reaction[]) {
    this._roles = value;
  }

  /**
   * Format Reaction roles into type
   * @param res
   * @returns Reaction[]
   */
  private fromReactionRolesPayload(res: ApiEmojiRole[]): Reaction[] {
    return res.map((r) => {
      return {
        [r.emoji_name]: r.emoji_role_name ?? r.emoji_action,
        eventType: r.emoji_type,
        roleType: r.emoji_role_type
      } as Reaction;
    });
  }

  /**
   * Get Reaction Roles
   * @returns Reaction[]
   */
  public async getReactionRoles(guild: Guild): Promise<Reaction[]> {
    if (this.reactionRoles.length) {
      return Promise.resolve(this.reactionRoles);
    }

    const res = await databaseService.get<any, ApiEmojiRole>(
      'emojis',
      guild.id as EmojisCollections
    );
    this.reactionRoles = this.fromReactionRolesPayload(res);
    return Promise.resolve(this.reactionRoles);
  }

  /**
   * ==================================
   * Fetch Emoji Actions
   * ==================================
   */

  /**
   * Get Reaction Actions
   */
  private get reactionActions() {
    return this._actions ?? [];
  }

  /**
   * Set Reaction Actions
   */
  private set reactionActions(value: Reaction[]) {
    this._actions = value;
  }
}

export const reactionModelService = new ReactionModelService();

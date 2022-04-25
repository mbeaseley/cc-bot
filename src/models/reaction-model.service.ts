import { DatabaseService } from 'Services/database.service';
import { ApiEmojiRole, ApiReactionAction } from 'Types/api/reaction';
import { EmojisCollections } from 'Types/database';
import { Reaction } from 'Types/reaction';

export class ReactionModelService {
  private databaseService: DatabaseService;
  private _roles: Reaction[] | undefined;
  private _actions: Reaction[] | undefined;

  constructor() {
    this.databaseService = new DatabaseService();
  }

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
      return { [r.emoji_name]: r.role_name, type: r.type } as Reaction;
    });
  }

  /**
   * Get Reaction Roles
   * @returns Reaction[]
   */
  public async getReactionRoles(): Promise<Reaction[]> {
    if (this.reactionRoles.length) {
      return Promise.resolve(this.reactionRoles);
    }

    const res = await this.databaseService.get<any, ApiEmojiRole>(
      'emojis',
      EmojisCollections.roles
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

  /**
   * Format Reaction actions into type
   * @param res
   * @returns Reaction[]
   */
  private fromReactionActionsPayload(res: ApiReactionAction[]): Reaction[] {
    return res.map((r) => {
      return { [r.emoji_name]: r.action } as Reaction;
    });
  }

  /**
   * Get Reaction Actions
   * @returns Reaction[]
   */
  public async getReactionActions(): Promise<Reaction[]> {
    if (this.reactionActions.length) {
      return Promise.resolve(this.reactionActions);
    }

    const res = await this.databaseService.get<any, ApiReactionAction>(
      'emojis',
      EmojisCollections.actions
    );
    this.reactionActions = this.fromReactionActionsPayload(res);
    return Promise.resolve(this.reactionActions);
  }
}

export const reactionModelService = new ReactionModelService();

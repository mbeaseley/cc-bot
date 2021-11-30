import { DatabaseService } from 'Services/database.service';
import { ServersCollection } from 'Types/database';
import { McServerDetail } from 'Types/minecraft';

export class MinecraftService {
  private databaseService: DatabaseService;

  constructor() {
    this.databaseService = new DatabaseService();
  }

  /**
   * Get Minecraft server details related to guild
   * @param guildId
   * @returns Promise<McServerDetail | undefined>
   */
  public async getServerDetails(
    guildId: string
  ): Promise<McServerDetail | undefined> {
    const res = (await this.databaseService.get(
      'servers',
      ServersCollection.minecraft
    )) as McServerDetail[];
    if (res.length) {
      return res.find((r) => r.guildId === guildId);
    }
    return undefined;
  }

  /**
   * Update Minecraft server details related to guild
   * @param guildId
   * @param domain
   * @param port
   */
  public async updateServerDetails(
    guildId: string,
    domain: string,
    port: string
  ): Promise<void> {
    return this.databaseService.update(
      'servers',
      ServersCollection.minecraft,
      {
        guildId,
      },
      {
        guildId,
        domain,
        port,
      }
    );
  }

  /**
   * Create and store Minecraft server details related to guild
   * @param guildId
   * @param domain
   * @param port
   * @returns
   */
  public async setServerDetails(
    guildId: string,
    domain: string,
    port: string
  ): Promise<void> {
    return this.databaseService.create('servers', ServersCollection.minecraft, {
      guildId,
      domain,
      port,
    });
  }
}

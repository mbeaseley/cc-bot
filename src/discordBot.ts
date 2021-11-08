// import { ArgsOf, Discord, On } from 'discordx';
// // import { MemberAdd } from 'Commands/misc/memberAdd';
// // import { MemberRemove } from 'Commands/misc/memberRemove';
// // import { ReactionRoles } from 'Commands/misc/reactionRoles';
// import { Main } from 'Root/main';
// // import { Logger } from 'Services/logger.service';
// // import { MusicService } from 'Services/music.service';
// // import { YoutubeService } from 'Services/youtube.service';
// import { environment } from 'Utils/environment';
// import Utility from 'Utils/utility';
// // import chalk from 'chalk';
// import { Guild } from 'discord.js';

// @Discord()
// export class DiscordBot {
//   // private logger: Logger;
//   // private reactionRoles: ReactionRoles;
//   // private memberAdd: MemberAdd;
//   // private memberRemove: MemberRemove;
//   // private musicService: MusicService;
//   // private youtubeService: YoutubeService;

//   constructor() {
//     // this.logger = new Logger();
//     // this.reactionRoles = new ReactionRoles();
//     // this.memberAdd = new MemberAdd();
//     // this.memberRemove = new MemberRemove();
//     // this.musicService = new MusicService();
//     // this.youtubeService = new YoutubeService();
//   }

//   /**
//    * @name initialize
//    * @description When bot has logged in output bot is ready.
//    */
//   @On('ready')
//   async initialize(): Promise<void> {
//     // this.logger.info('info check');
//     // this.logger.warn('warning check');
//     // this.logger.error('error check');

//     // init all applicaiton commands
//     await Main.Client.initApplicationCommands({
//       guild: { log: true },
//       global: { log: true },
//     });

//     // init permissions; enabled log to see changes
//     await Main.Client.initApplicationPermissions(true);

//     // Bot Actions
//     Main.Client.user?.setActivity(`@${environment.botName} | help`, {
//       type: 'LISTENING',
//     });

//     const guild = Utility.getGuild(Main.Client.guilds);
//     this.preFetchAllMessages(guild);

//     // this.memberAdd.init(Main.Client);
//     // this.memberRemove.init(Main.Client);
//     // this.reactionRoles.init(Main.Client);
//     // this.musicService.init();
//     // // Checks for new videos being published
//     // this.youtubeService.check(Main.Client);

//     // this.logger.info(chalk.bold('BOT READY'));
//     console.log('READY!');
//   }

//   /**
//    * Fetch all messages and add to memory
//    * @param guild
//    * @returns void
//    */
//   preFetchAllMessages(guild: Guild | undefined): void {
//     return guild?.channels.cache.forEach(async (ch) => {
//       if (ch.isText()) {
//         await ch.messages.fetch();
//       }

//       return Promise.resolve();
//     });
//   }

//   /**
//    * @name error
//    * @param error
//    * @description When client has a discord error log it here.
//    */
//   @On('error')
//   error([error]: ArgsOf<'error'>): void {
//     console.log(error);
//     // this.logger.error(`${chalk.bold('BOT ERROR')}: ${error}`);
//   }
// }

import { Guild, Interaction, Message } from 'discord.js';
import { ArgsOf, Discord, On } from 'discordx';
import { Logger } from 'Services/logger.service';
import { Main } from 'Root/main';
import { environment } from 'Utils/environment';
import Utility from 'Utils/utility';
import chalk from 'chalk';

@Discord()
export class DiscordBot {
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  /**
   * Initialize bot
   */
  @On('ready')
  async initialize(): Promise<void> {
    this.logger.info('info check');
    this.logger.warn('warning check');
    this.logger.error('error check');

    // init all applicaiton commands
    await Main.Client.initApplicationCommands({
      guild: { log: true },
      global: { log: true },
    });

    // init permissions; enabled log to see changes
    await Main.Client.initApplicationPermissions(true);

    Main.Client.user?.setActivity(`@${environment.botName} | help`, {
      type: 'LISTENING',
    });

    const guild = Utility.getGuild(Main.Client.guilds);
    this.preFetchAllMessages(guild);

    this.logger.info(chalk.bold('BOT READY'));
  }

  /**
   * Fetch all messages and add to memory
   * @param guild
   * @returns void
   */
  preFetchAllMessages(guild: Guild | undefined): void {
    return guild?.channels.cache.forEach(async (ch) => {
      if (ch.isText()) {
        await ch.messages.fetch();
      }

      return Promise.resolve();
    });
  }

  /**
   * Execute interaction
   * @param interaction
   */
  @On('interactionCreate')
  async executeInteraction(interaction: Interaction): Promise<unknown> {
    return Main.Client.executeInteraction(interaction);
  }

  /**
   * Execute command
   * @param message
   */
  @On('messageCreate')
  async executeCommand(message: Message): Promise<unknown> {
    return Main.Client.executeCommand(message);
  }

  /**
   * On error
   * @param param
   */
  @On('error')
  error([error]: ArgsOf<'error'>): void {
    this.logger.error(`${chalk.bold('BOT ERROR')}: ${error}`);
  }
}

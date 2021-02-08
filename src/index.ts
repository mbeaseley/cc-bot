import * as fs from 'fs';
import { Client, Command, CommandMessage, Discord, On } from '@typeit/discord';
import { AppUtils, BotConfig } from './utlis';

@Discord('!')
export class AppDiscord {
  private static client: Client;

  static get Client(): Client {
    return this.client;
  }

  static get Config(): BotConfig {
    return AppUtils.getConfig();
  }

  static start(): void {
    const __dirname = fs.realpathSync('.');
    const config = AppUtils.getConfig() as BotConfig;
    this.client = new Client();

    this.client.login(config?.token, `${__dirname}/*.ts`, `${__dirname}/*.js`);
  }

  @On('ready')
  initialize(): void {
    console.log('Bot logged in.');
  }

  @Command('ping')
  ping(command: CommandMessage): void {
    command.reply('pong!');
  }

  @Command('userchoice')
  chooseMember(command: CommandMessage): void {
    // Finds channel
    const channel = command?.guild?.channels.cache.get('787770844066611200');
    // Finds and get usernames in channel
    const users = channel?.guild.members.cache
      .map((x) => {
        if (!x.user?.bot) {
          return x.user;
        }
      })
      .filter((v, i, s) => v?.id && s.indexOf(v) === i)
      .map((x) => {
        return x?.username as string;
      });

    // Randomly chooses channel user
    users?.length
      ? command.reply(users[Math.floor(Math.random() * users.length)])
      : command.reply('Sorry I failed you!');
  }
}

AppDiscord.start();

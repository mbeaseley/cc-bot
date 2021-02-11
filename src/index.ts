import * as fs from 'fs';
import { Client, Command, CommandMessage, Discord, On } from '@typeit/discord';
import { ChoosePlayer } from './commands/choosePlayer';
import { AppUtils, BotConfig } from './utils';

@Discord('!')
export class AppDiscord {
  private static client: Client;
  private choosePlayer: ChoosePlayer;

  constructor() {
    this.choosePlayer = new ChoosePlayer();
  }

  static get Client(): Client {
    return this.client;
  }

  static start(): void {
    const __dirname = fs.realpathSync('.');
    const token = (AppUtils.getConfig() as BotConfig)?.token;
    this.client = new Client();

    this.client.login(token, `${__dirname}/*.ts`, `${__dirname}/*.js`);
  }

  @On('ready')
  initialize(): void {
    console.log('Bot logged in.');
  }

  @Command('ping')
  ping(command: CommandMessage): void {
    command.reply('pong!');
  }

  @Command('playerchoice')
  playerInit(command: CommandMessage): Promise<void> {
    return this.choosePlayer
      .init(command)
      .then((player) => {
        command.reply(player);
      })
      .catch((e) => {
        command.reply(e);
      });
  }
}

AppDiscord.start();

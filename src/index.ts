import * as fs from 'fs';
import {
  Client,
  Command,
  CommandMessage,
  Description,
  Discord,
  On,
} from '@typeit/discord';
import { ChoosePlayer } from './commands/choosePlayer';
import { DadJoke } from './commands/dadJoke';
import { AppUtils, BotConfig } from './utils';

@Discord(
  `<${AppUtils.getConfig()?.botId}> ` || `<${AppUtils.getConfig()?.botId}> `
)
export class AppDiscord {
  private static client: Client;
  private choosePlayer: ChoosePlayer;
  private dadJoke: DadJoke;

  constructor() {
    this.choosePlayer = new ChoosePlayer();
    this.dadJoke = new DadJoke();
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
    AppDiscord.client.user?.setActivity('@CC Bot', { type: 'LISTENING' });
  }

  @Command('playerchoice')
  @Description(
    'Chooses active member on the voice channel that the asker is within!'
  )
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

  @Command('joke')
  @Description(`Who doesn't want a bad joke!`)
  jokeInit(command: CommandMessage): Promise<void> {
    return this.dadJoke
      .init()
      .then((joke) => {
        command.reply(joke);
      })
      .catch((e) => {
        command.reply(e);
      });
  }

  @Command('help')
  helpInit(): void {
    console.log(Client.getCommands());
  }
}

AppDiscord.start();

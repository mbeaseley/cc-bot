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
  @Description('Chooses Player')
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
  @Description('Joke')
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
  helpInit(command: CommandMessage): void {
    const commands = Client.getCommands();
    const fields = commands
      .filter((c) => c.commandName !== 'help')
      .map((c) => {
        return {
          name: `**${c.description}**`,
          value: `\`@CC Bot ${c.commandName}\``,
          inline: true,
        };
      });

    command.channel.send({
      embed: {
        color: 10181046,
        author: {
          name: `${command?.client?.user?.username} Plugin Commands`,
          icon_url: command?.client?.user?.displayAvatarURL(),
        },
        // url: '',
        fields,
      },
    });
  }
}

AppDiscord.start();

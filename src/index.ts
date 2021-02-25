import * as fs from 'fs';
import {
  ArgsOf,
  Client,
  Command,
  CommandMessage,
  Description,
  Discord,
  On,
  Rule,
  Rules,
} from '@typeit/discord';
import { ChoosePlayer } from './commands/choosePlayer';
import { DadJoke } from './commands/dadJoke';
import { Insult } from './commands/insults';
import { AppUtils, BotConfig } from './utils';

@Discord('')
@Rules(Rule().fromString(`${AppUtils.getConfig()?.botId}> `))
export class AppDiscord {
  private static client: Client;
  private choosePlayer: ChoosePlayer;
  private dadJoke: DadJoke;
  private insults: Insult;

  constructor() {
    this.choosePlayer = new ChoosePlayer();
    this.dadJoke = new DadJoke();
    this.insults = new Insult();
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
      .catch(() => {
        command.reply(`I have failed you!`);
      });
  }

  @Command('insult')
  @Description('Joke')
  insultInit(command: CommandMessage): Promise<void> {
    return this.insults
      .init(command)
      .then((insult: string) => {
        insult.startsWith('<')
          ? command.channel.send(insult)
          : command.reply(insult);
      })
      .catch(() => {
        command.reply(`I have failed you!`);
      });
  }

  @Command('help')
  helpInit(command: CommandMessage): void {
    const commands = Client.getCommands();
    const fields = commands
      .filter((c) => c.commandName !== 'help')
      .map((c, i) => {
        if (c.commandName === 'insult') {
          c.commandName = 'insult @user(optional)';
        }

        const inline = (i + 1) % 3 === 0 ? false : true;

        return {
          name: `**${c.description}**`,
          value: `\`@CC Bot ${c.commandName}\``,
          inline,
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

  // @On('message')
  // onInit([message]: ArgsOf<'message'>, client: Client): void {
  //   console.log(message.content);
  // }
}

AppDiscord.start();

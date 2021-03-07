import * as fs from 'fs';
import {
  Client,
  Command,
  CommandMessage,
  Description,
  Discord,
  On,
  Rule,
  Rules,
} from '@typeit/discord';
import 'dotenv/config';
import { ChoosePlayer } from './commands/choosePlayer';
import { Compliment } from './commands/compliment';
import { DadJoke } from './commands/dadJoke';
import { Help } from './commands/help';
import { Insult } from './commands/insults';
import { SayIt } from './commands/sayIt';

@Discord('<')
@Rules(Rule().fromString(`${process.env.BOTID}> ` || `${process.env.BOTID}>`))
export default class AppDiscord {
  private static client: Client;
  choosePlayer: ChoosePlayer;
  dadJoke: DadJoke;
  insults: Insult;
  help: Help;
  compliment: Compliment;
  sayIt: SayIt;

  constructor() {
    this.choosePlayer = new ChoosePlayer();
    this.dadJoke = new DadJoke();
    this.insults = new Insult();
    this.help = new Help();
    this.compliment = new Compliment();
    this.sayIt = new SayIt();
  }

  static get Client(): Client {
    return this.client;
  }

  static async start(): Promise<void> {
    const __dirname = fs.realpathSync('.');
    const token = process.env.TOKEN || '';
    AppDiscord.client = new Client();

    AppDiscord.client.login(token, `${__dirname}/*.ts`, `${__dirname}/*.js`);
  }

  @On('ready')
  initialize(): void {
    try {
      console.log('Bot logged in.');
      AppDiscord.client.user?.setActivity('@CC Bot | help', {
        type: 'LISTENING',
      });
    } catch (e) {
      console.log(e);
    }
  }

  @Command('playerchoice')
  @Description('Chooses Player')
  playerInit(command: CommandMessage): Promise<void> {
    return this.choosePlayer.init(command);
  }

  @Command('joke')
  @Description('Joke')
  jokeInit(command: CommandMessage): Promise<void> {
    return this.dadJoke.init(command).catch(() => {
      command.reply(`I have failed you!`);
    });
  }

  @Command('insult')
  @Description('Insult')
  insultInit(command: CommandMessage): Promise<void> {
    return this.insults.init(command).catch(() => {
      command.reply(`I have failed you!`);
    });
  }

  @Command('compliment')
  @Description('Compliment')
  complimentInit(command: CommandMessage): Promise<void> {
    return this.compliment.init(command).catch(() => {
      command.reply(`I have failed you!`);
    });
  }

  @Command('sayIt')
  @Description('Say It')
  sayItInit(command: CommandMessage): Promise<void> {
    return this.sayIt.init(command).catch(() => {
      command.reply(`I have failed you!`);
    });
  }

  @Command('help')
  helpInit(command: CommandMessage): Promise<void> {
    const allCommands = Client.getCommands();

    return this.help.init(command, allCommands).catch(() => {
      command.reply(`I have failed you!`);
    });
  }
}

AppDiscord.start();

import * as fs from 'fs';
import {
  Client,
  Command,
  CommandMessage,
  Description,
  Discord,
  Guard,
  On,
  Rule,
  Rules,
} from '@typeit/discord';
import 'dotenv/config';
import { Message } from 'discord.js';
import { ChoosePlayer } from './commands/choosePlayer';
import { Compliment } from './commands/compliment';
import { DadJoke } from './commands/dadJoke';
import { Dbd } from './commands/dbd';
import { Help } from './commands/help';
import { Insult } from './commands/insults';
import { Purge } from './commands/purge';
import { SayIt } from './commands/sayIt';
import { isAdmin } from './guards/isAdmin';
import * as environment from './utils/environment';

@Discord('<')
@Rules(
  Rule().fromString(
    `${environment.default.botId}> ` || `${environment.default.botId}>`
  )
)
export default class AppDiscord {
  private static client: Client;
  choosePlayer: ChoosePlayer;
  dadJoke: DadJoke;
  insults: Insult;
  help: Help;
  compliment: Compliment;
  sayIt: SayIt;
  purge: Purge;
  dbd: Dbd;

  private errorMessage = 'I have failed you!';

  constructor() {
    this.choosePlayer = new ChoosePlayer();
    this.dadJoke = new DadJoke();
    this.insults = new Insult();
    this.help = new Help();
    this.compliment = new Compliment();
    this.sayIt = new SayIt();
    this.purge = new Purge();
    this.dbd = new Dbd();
  }

  static get Client(): Client {
    return this.client;
  }

  static async start(): Promise<void> {
    const __dirname = fs.realpathSync('.');
    const token = environment.default.token;
    AppDiscord.client = new Client();

    AppDiscord.client.login(token, `${__dirname}/*.ts`, `${__dirname}/*.js`);
  }

  @On('ready')
  initialize(): void {
    try {
      console.log('Bot logged in.');
      AppDiscord.client.user?.setActivity(
        `@${environment.default.botName} | help`,
        {
          type: 'LISTENING',
        }
      );
    } catch (e) {
      console.log(e);
    }
  }

  @Command('playerchoice')
  @Description('Chooses Player')
  playerInit(command: CommandMessage): Promise<void> {
    return this.choosePlayer.init(command).catch(() => {
      command.reply(this.errorMessage);
    });
  }

  @Command('joke')
  @Description('Joke')
  jokeInit(command: CommandMessage): Promise<void> {
    return this.dadJoke.init(command).catch(() => {
      command.reply(this.errorMessage);
    });
  }

  @Command('insult')
  @Description('Insult')
  insultInit(command: CommandMessage): Promise<void> {
    return this.insults.init(command).catch(() => {
      command.reply(this.errorMessage);
    });
  }

  @Command('compliment')
  @Description('Compliment')
  complimentInit(command: CommandMessage): Promise<void> {
    return this.compliment.init(command).catch(() => {
      command.reply(this.errorMessage);
    });
  }

  @Command('sayIt')
  @Description('Say It')
  sayItInit(command: CommandMessage): Promise<void> {
    return this.sayIt.init(command).catch(() => {
      command.reply(this.errorMessage);
    });
  }

  @Command('purge')
  @Description('Purge a maximum of 100 messages')
  @Guard(isAdmin)
  purgeInit(command: CommandMessage): Promise<void> {
    return this.purge.init(command).catch(() => {
      command.reply(this.errorMessage);
    });
  }

  @Command('dbd')
  @Description('Dbd (dbd help for all possible commands)')
  dbdInit(command: CommandMessage): Promise<Message | void> {
    return this.dbd.init(command).catch(() => {
      command.reply(this.errorMessage);
    });
  }

  @Command('help')
  helpInit(command: CommandMessage): Promise<void> {
    const allCommands = Client.getCommands();

    return this.help.init(command, allCommands).catch(() => {
      command.reply(this.errorMessage);
    });
  }
}

AppDiscord.start();

import chalk from 'chalk';
import dayjs from 'dayjs';

export class Logger {
  private static logger: Logger;
  private date: string = dayjs().format('YYYY-MM-DD HH:mm:ss');

  public info(message: string): void {
    console.log(chalk.bgCyan(`✔ ${this.date} : `, chalk.underline(message)));
  }

  public warn(message: string): void {
    console.log(chalk.bgYellow(chalk.black(`⚠ ${this.date} : `, chalk.underline(message))));
  }

  public error(message: string): void {
    console.log(chalk.bgRed(`⛔ ${this.date} : `, chalk.underline(message)));
  }

  public getInstance(): Logger {
    if (!Logger.logger) {
      Logger.logger = new Logger();
    }
    return Logger.logger;
  }
}

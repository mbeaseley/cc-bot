import * as chalk from 'chalk';
import { MongoClient } from 'mongodb';
import { Logger } from 'Services/logger.service';
import { DatabaseName, Databases } from 'Types/database';
import { environment } from 'Utils/environment';

export class DatabaseService {
  private _client: MongoClient | undefined;
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  /**
   * Get Client
   */
  private get Client(): MongoClient | undefined {
    return this._client;
  }

  /**
   * Set Client
   */
  private set Client(client: MongoClient | undefined) {
    this._client = client;
  }

  /**
   * Get named collection from named database
   * @param client
   * @param dbName
   * @param collectionName
   */
  private async getCollection<T extends DatabaseName>(
    dbName: DatabaseName,
    collectionName: Databases[T]
  ): Promise<any[]> {
    const db = this.Client?.db(dbName);
    return db?.collection(collectionName).find().toArray() ?? [];
  }

  /**
   *  Connects to Mongodb
   */
  async connect<T extends DatabaseName>(
    dbName: DatabaseName,
    collectionName: Databases[T]
  ): Promise<any[]> {
    let dbResponse: any[] = [];
    this.Client = this.setConnection();

    try {
      await this.Client.connect();
      dbResponse = await this.getCollection(dbName, collectionName);
    } catch (e: unknown) {
      this.logger.error(`${chalk.bold('BOT ERROR')}: ${e}`);
    } finally {
      await this.Client.close();
    }

    return Promise.resolve(dbResponse);
  }

  /**
   * Set connection uri and options
   * @returns MongoClient
   */
  setConnection(): MongoClient {
    const uri = `mongodb+srv://${environment.dbUsername}:${environment.dbPassword}@cluster0.6ubpu.mongodb.net/test?retryWrites=true&w=majority`;
    return new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}

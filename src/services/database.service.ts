import { MongoClient } from 'mongodb';
import * as chalk from 'chalk';
import { Logger } from './logger.service';
import { environment } from '../utils/environment';
import { DatabaseName, Databases } from 'src/types/database';

export class DatabaseService {
  private _client: MongoClient | undefined;
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  private get Client(): MongoClient | undefined {
    return this._client;
  }

  private set Client(client: MongoClient | undefined) {
    this._client = client;
  }

  /**
   * Get named collection from named database
   * @param client
   * @param dbName
   * @param collectionName
   */
  public async getCollection<T extends DatabaseName>(
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

    return dbResponse;
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

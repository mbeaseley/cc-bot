import { environment } from '../utils/environment';
import { Logger } from '../services/logger.service';
import { DatabaseName, Databases } from '../types/database';
import * as chalk from 'chalk';
import {
  InsertOneWriteOpResult,
  MongoClient,
  UpdateWriteOpResult,
} from 'mongodb';

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
   * ==================================
   * Connect to database
   * ==================================
   */

  /**
   * Set connection uri and options
   * @returns MongoClient
   */
  private setConnection(): MongoClient {
    const uri = `mongodb+srv://${environment.dbUsername}:${environment.dbPassword}@cluster0.6ubpu.mongodb.net/test?retryWrites=true&w=majority`;
    return new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  /**
   * ==================================
   * Get
   * ==================================
   */

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
   * Get collection data
   * @param dbName
   * @param collectionName
   */
  public async get<T extends DatabaseName>(
    dbName: DatabaseName,
    collectionName: Databases[T]
  ): Promise<any[]> {
    let res: any[] = [];
    this.Client = this.setConnection();

    try {
      await this.Client.connect();
      res = await this.getCollection(dbName, collectionName);
    } catch (e: unknown) {
      this.logger.error(`${chalk.bold('BOT ERROR')}: ${e}`);
    } finally {
      await this.Client.close();
      return res;
    }
  }

  /**
   * ==================================
   * Create
   * ==================================
   */

  /**
   * Create and insert document
   * @param dbName
   * @param collectionName
   * @param document
   */
  private async createDocument<T extends DatabaseName>(
    dbName: DatabaseName,
    collectionName: Databases[T],
    document: Object
  ): Promise<InsertOneWriteOpResult<any> | undefined> {
    const db = this.Client?.db(dbName);
    return db?.collection(collectionName).insertOne(document);
  }

  /**
   * Create document in collection
   * @param dbName
   * @param collectionName
   * @param document
   */
  public async create<T extends DatabaseName>(
    dbName: DatabaseName,
    collectionName: Databases[T],
    document: Object
  ): Promise<void> {
    this.Client = this.setConnection();

    try {
      await this.Client.connect();
      await this.createDocument(dbName, collectionName, document);
    } catch (e: unknown) {
      this.logger.error(`${chalk.bold('BOT ERROR')}: ${e}`);
    } finally {
      await this.Client.close();
    }
  }

  /**
   * ==================================
   * Update
   * ==================================
   */
  private async updateDocument<T extends DatabaseName>(
    dbName: DatabaseName,
    collectionName: Databases[T],
    existDocument: Object,
    document: Object
  ): Promise<UpdateWriteOpResult | undefined> {
    const db = this.Client?.db(dbName);
    return db
      ?.collection(collectionName)
      .updateOne(existDocument, { $set: document });
  }

  /**
   * Get collection data
   * @param dbName
   * @param collectionName
   */
  public async update<T extends DatabaseName>(
    dbName: DatabaseName,
    collectionName: Databases[T],
    existDocument: Object,
    document: Object
  ): Promise<void> {
    this.Client = this.setConnection();

    try {
      await this.Client.connect();
      await this.updateDocument(
        dbName,
        collectionName,
        existDocument,
        document
      );
    } catch (e: unknown) {
      this.logger.error(`${chalk.bold('BOT ERROR')}: ${e}`);
    } finally {
      await this.Client.close();
    }
  }
}

import knex, { Knex } from 'knex'
import { config } from './config'

class DatabaseFactory {
  private static instance: Knex | null = null;

  public static getConnection(): Knex {
    if (!DatabaseFactory.instance) {
      DatabaseFactory.instance = DatabaseFactory.createConnection();
    }
    return DatabaseFactory.instance;
  }

  public static createConnection(): Knex {
    const dbConfig = config.database;
    const environment = config.environment;

    const knexConfig: Knex.Config = {
      client: 'pg',
      connection: {
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.user,
        password: dbConfig.password,
        database: environment === 'test' ? `${dbConfig.database}-test` : dbConfig.database,
      },
      pool: {
        min: dbConfig.poolMin,
        max: dbConfig.poolMax,
      },
      migrations: {
        directory: './migrations',
        extension: 'ts',
      },
      seeds: {
        directory: './seeds',
      },
    };

    return knex(knexConfig);
  }

  public static async closeConnection(): Promise<void> {
    if (DatabaseFactory.instance) {
      await DatabaseFactory.instance.destroy();
      DatabaseFactory.instance = null;
    }
  }

  public static async resetConnection(): Promise<Knex> {
    await DatabaseFactory.closeConnection();
    return DatabaseFactory.getConnection();
  }
}

export const db = DatabaseFactory.getConnection();

export { DatabaseFactory };

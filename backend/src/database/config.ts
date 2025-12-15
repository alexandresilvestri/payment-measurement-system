export type Environment = 'development' | 'test' | 'production';

interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  poolMin: number;
  poolMax: number;
}

interface ServerConfig {
  port: number;
  nodeEnv: Environment;
}

interface AppConfig {
  server: ServerConfig;
  database: DatabaseConfig;
}

class Config {
  private static instance: Config;
  private config: AppConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  private loadConfig(): AppConfig {
    const nodeEnv = (process.env.NODE_ENV || 'development') as Environment;

    return {
      server: {
        port: Number(process.env.PORT) || 8080,
        nodeEnv,
      },
      database: {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'conf',
        poolMin: Number(process.env.DB_POOL_MIN) || 2,
        poolMax: Number(process.env.DB_POOL_MAX) || 10,
      },
    };
  }

  public get server(): ServerConfig {
    return this.config.server;
  }

  public get database(): DatabaseConfig {
    return this.config.database;
  }

  public get environment(): Environment {
    return this.config.server.nodeEnv;
  }

  public isDevelopment(): boolean {
    return this.config.server.nodeEnv === 'development';
  }

  public isTest(): boolean {
    return this.config.server.nodeEnv === 'test';
  }

  public isProduction(): boolean {
    return this.config.server.nodeEnv === 'production';
  }
}

export const config = Config.getInstance();

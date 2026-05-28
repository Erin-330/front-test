import * as Joi from 'joi';

export interface AppConfig {
  NODE_ENV: 'development' | 'test' | 'staging' | 'production';
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  DB_SYNCHRONIZE: boolean;
  DB_LOGGING: boolean;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  THROTTLE_TTL: number;
  THROTTLE_LIMIT: number;
  CORS_ORIGIN: string;
}

export const validationSchema = Joi.object<AppConfig>({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'staging', 'production')
    .default('development'),
  PORT: Joi.number().default(5013),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().allow('').required(),
  DB_DATABASE: Joi.string().required(),
  DB_SYNCHRONIZE: Joi.boolean().default(false),
  DB_LOGGING: Joi.boolean().default(false),
  JWT_SECRET: Joi.string().min(16).required(),
  JWT_EXPIRES_IN: Joi.string().default('1d'),
  THROTTLE_TTL: Joi.number().default(60),
  THROTTLE_LIMIT: Joi.number().default(100),
  CORS_ORIGIN: Joi.string().default('*'),
});

export default (): Partial<AppConfig> => ({
  NODE_ENV: (process.env.NODE_ENV as AppConfig['NODE_ENV']) ?? 'development',
  PORT: Number(process.env.PORT ?? 5013),
  DB_HOST: process.env.DB_HOST ?? 'localhost',
  DB_PORT: Number(process.env.DB_PORT ?? 5432),
  DB_USERNAME: process.env.DB_USERNAME ?? 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD ?? '',
  DB_DATABASE: process.env.DB_DATABASE ?? 'woody_rorr',
  DB_SYNCHRONIZE: process.env.DB_SYNCHRONIZE === 'true',
  DB_LOGGING: process.env.DB_LOGGING === 'true',
  JWT_SECRET: process.env.JWT_SECRET ?? '',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '1d',
  THROTTLE_TTL: Number(process.env.THROTTLE_TTL ?? 60),
  THROTTLE_LIMIT: Number(process.env.THROTTLE_LIMIT ?? 100),
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? '*',
});

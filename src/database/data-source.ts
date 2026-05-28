import 'reflect-metadata';
import { config as loadEnv } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../modules/auth/entities/user.entity';
import { AttemptAnswer } from '../modules/attempt/entities/attempt-answer.entity';
import { Attempt } from '../modules/attempt/entities/attempt.entity';
import { Question } from '../modules/quiz/entities/question.entity';
import { Quiz } from '../modules/quiz/entities/quiz.entity';

loadEnv();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'woody_rorr',
  entities: [User, Quiz, Question, Attempt, AttemptAnswer],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
};

export const AppDataSource = new DataSource(dataSourceOptions);

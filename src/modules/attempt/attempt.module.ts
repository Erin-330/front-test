import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizModule } from '../quiz/quiz.module';
import { AttemptController } from './attempt.controller';
import { AttemptRepository } from './attempt.repository';
import { AttemptService } from './attempt.service';
import { AttemptAnswer } from './entities/attempt-answer.entity';
import { Attempt } from './entities/attempt.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attempt, AttemptAnswer]), QuizModule],
  controllers: [AttemptController],
  providers: [AttemptService, AttemptRepository],
  exports: [AttemptService, AttemptRepository],
})
export class AttemptModule {}

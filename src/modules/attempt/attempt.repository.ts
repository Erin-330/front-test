import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListAttemptsQueryDto } from './dto/list-attempts-query.dto';
import { AttemptAnswer } from './entities/attempt-answer.entity';
import { Attempt } from './entities/attempt.entity';

@Injectable()
export class AttemptRepository {
  constructor(
    @InjectRepository(Attempt)
    private readonly attemptRepo: Repository<Attempt>,
    @InjectRepository(AttemptAnswer)
    private readonly answerRepo: Repository<AttemptAnswer>,
  ) {}

  async listForUser(
    userId: number,
    query: ListAttemptsQueryDto,
  ): Promise<{ items: Attempt[]; total: number }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const qb = this.attemptRepo
      .createQueryBuilder('attempt')
      .leftJoinAndSelect('attempt.quiz', 'quiz')
      .where('attempt.user_id = :userId', { userId });

    if (query.quizId) {
      qb.andWhere('attempt.quiz_id = :quizId', { quizId: query.quizId });
    }

    qb.orderBy('attempt.submitted_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total };
  }

  findByIdForUser(id: number, userId: number): Promise<Attempt | null> {
    return this.attemptRepo
      .createQueryBuilder('attempt')
      .leftJoinAndSelect('attempt.quiz', 'quiz')
      .where('attempt.id = :id', { id })
      .andWhere('attempt.user_id = :userId', { userId })
      .getOne();
  }

  findAnswersByAttemptId(attemptId: number): Promise<AttemptAnswer[]> {
    return this.answerRepo.find({
      where: { attemptId },
      relations: { question: true },
      order: { id: 'ASC' },
    });
  }
}

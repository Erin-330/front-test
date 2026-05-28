import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Question } from '../quiz/entities/question.entity';
import { Quiz } from '../quiz/entities/quiz.entity';
import { AttemptRepository } from './attempt.repository';
import { AttemptDetailResponseDto } from './dto/attempt-detail-response.dto';
import {
  AttemptListResponseDto,
  AttemptSummaryResponseDto,
} from './dto/attempt-summary-response.dto';
import { CreateAttemptResponseDto } from './dto/create-attempt-response.dto';
import { CreateAttemptDto } from './dto/create-attempt.dto';
import { ListAttemptsQueryDto } from './dto/list-attempts-query.dto';
import { AttemptAnswer } from './entities/attempt-answer.entity';
import { Attempt } from './entities/attempt.entity';

@Injectable()
export class AttemptService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly attemptRepo: AttemptRepository,
  ) {}

  async submit(
    quizId: number,
    userId: number,
    dto: CreateAttemptDto,
  ): Promise<CreateAttemptResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      const quiz = await manager.getRepository(Quiz).findOne({ where: { id: quizId } });
      if (!quiz || !quiz.isPublished) {
        throw new NotFoundException(`Quiz with id ${quizId} not found`);
      }

      const questions = await manager.getRepository(Question).find({
        where: { quizId },
        order: { orderIndex: 'ASC', id: 'ASC' },
      });
      if (questions.length === 0) {
        throw new BadRequestException('Quiz has no questions');
      }

      const questionMap = new Map<number, Question>();
      for (const q of questions) {
        questionMap.set(Number(q.id), q);
      }

      const submittedIds = new Set<number>();
      for (const ans of dto.answers) {
        if (!questionMap.has(Number(ans.questionId))) {
          throw new BadRequestException(
            `Question ${ans.questionId} does not belong to quiz ${quizId}`,
          );
        }
        if (submittedIds.has(Number(ans.questionId))) {
          throw new BadRequestException(
            `Duplicate answer for question ${ans.questionId}`,
          );
        }
        submittedIds.add(Number(ans.questionId));
      }

      const totalQuestions = questions.length;
      let correctCount = 0;
      const gradedAnswers: AttemptAnswer[] = [];

      for (const ans of dto.answers) {
        const question = questionMap.get(Number(ans.questionId))!;
        const isCorrect = ans.selectedIndex === question.correctIndex;
        if (isCorrect) {
          correctCount += 1;
        }
        const answer = manager.getRepository(AttemptAnswer).create({
          questionId: Number(question.id),
          selectedIndex: ans.selectedIndex,
          isCorrect,
        });
        gradedAnswers.push(answer);
      }

      const score = Math.round((correctCount / totalQuestions) * 100);

      const attempt = manager.getRepository(Attempt).create({
        quizId,
        userId,
        score,
        totalQuestions,
        correctCount,
        submittedAt: new Date(),
      });
      const savedAttempt = await manager.getRepository(Attempt).save(attempt);

      for (const a of gradedAnswers) {
        a.attemptId = Number(savedAttempt.id);
      }
      await manager.getRepository(AttemptAnswer).save(gradedAnswers);

      return {
        id: Number(savedAttempt.id),
        quizId,
        score,
        totalQuestions,
        correctCount,
        submittedAt: savedAttempt.submittedAt,
        answers: gradedAnswers.map((a) => {
          const q = questionMap.get(a.questionId)!;
          return {
            questionId: a.questionId,
            selectedIndex: a.selectedIndex,
            correctIndex: q.correctIndex,
            isCorrect: a.isCorrect,
            explanation: q.explanation ?? null,
          };
        }),
      };
    });
  }

  async list(
    userId: number,
    query: ListAttemptsQueryDto,
  ): Promise<AttemptListResponseDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const { items, total } = await this.attemptRepo.listForUser(userId, query);

    const summaries: AttemptSummaryResponseDto[] = items.map((attempt) => ({
      id: Number(attempt.id),
      quizId: Number(attempt.quizId),
      quizTitle: attempt.quiz?.title ?? '',
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      correctCount: attempt.correctCount,
      submittedAt: attempt.submittedAt,
    }));

    return { items: summaries, total, page, limit };
  }

  async findById(
    id: number,
    userId: number,
  ): Promise<AttemptDetailResponseDto> {
    const attempt = await this.attemptRepo.findByIdForUser(id, userId);
    if (!attempt) {
      throw new NotFoundException(`Attempt with id ${id} not found`);
    }

    const answers = await this.attemptRepo.findAnswersByAttemptId(id);

    return {
      id: Number(attempt.id),
      quizId: Number(attempt.quizId),
      quizTitle: attempt.quiz?.title ?? '',
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      correctCount: attempt.correctCount,
      submittedAt: attempt.submittedAt,
      answers: answers.map((a) => ({
        questionId: Number(a.questionId),
        prompt: a.question?.prompt ?? '',
        choices: a.question?.choices ?? [],
        selectedIndex: a.selectedIndex,
        correctIndex: a.question?.correctIndex ?? -1,
        isCorrect: a.isCorrect,
        explanation: a.question?.explanation ?? null,
      })),
    };
  }
}

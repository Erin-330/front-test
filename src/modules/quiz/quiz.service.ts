import { Injectable, NotFoundException } from '@nestjs/common';
import { QuizDetailResponseDto } from './dto/quiz-detail-response.dto';
import { QuizListQueryDto } from './dto/quiz-list-query.dto';
import { QuizListResponseDto, QuizResponseDto } from './dto/quiz-response.dto';
import { QuizRepository } from './quiz.repository';

@Injectable()
export class QuizService {
  constructor(private readonly quizRepo: QuizRepository) {}

  async list(query: QuizListQueryDto): Promise<QuizListResponseDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const { items, total } = await this.quizRepo.findManyWithCounts(query);

    const data: QuizResponseDto[] = items.map(({ quiz, questionCount }) => ({
      id: Number(quiz.id),
      title: quiz.title,
      description: quiz.description ?? null,
      category: quiz.category ?? null,
      difficulty: quiz.difficulty ?? null,
      questionCount,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
    }));

    return { items: data, total, page, limit };
  }

  async findById(id: number): Promise<QuizDetailResponseDto> {
    const quiz = await this.quizRepo.findById(id);
    if (!quiz || !quiz.isPublished) {
      throw new NotFoundException(`Quiz with id ${id} not found`);
    }

    const questions = await this.quizRepo.findQuestionsByQuizId(id);

    return {
      id: Number(quiz.id),
      title: quiz.title,
      description: quiz.description ?? null,
      category: quiz.category ?? null,
      difficulty: quiz.difficulty ?? null,
      questions: questions.map((q) => ({
        id: Number(q.id),
        prompt: q.prompt,
        choices: q.choices,
        orderIndex: q.orderIndex,
      })),
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
    };
  }
}

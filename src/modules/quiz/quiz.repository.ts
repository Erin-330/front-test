import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizListQueryDto } from './dto/quiz-list-query.dto';
import { Question } from './entities/question.entity';
import { Quiz } from './entities/quiz.entity';

export interface QuizListItem {
  quiz: Quiz;
  questionCount: number;
}

@Injectable()
export class QuizRepository {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepo: Repository<Quiz>,
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
  ) {}

  async findManyWithCounts(query: QuizListQueryDto): Promise<{ items: QuizListItem[]; total: number }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const qb = this.quizRepo
      .createQueryBuilder('quiz')
      .where('quiz.is_published = :published', { published: true });

    if (query.category) {
      qb.andWhere('quiz.category = :category', { category: query.category });
    }
    if (query.difficulty) {
      qb.andWhere('quiz.difficulty = :difficulty', { difficulty: query.difficulty });
    }
    if (query.search) {
      qb.andWhere('quiz.title ILIKE :search', { search: `%${query.search}%` });
    }

    qb.orderBy('quiz.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [quizzes, total] = await qb.getManyAndCount();

    const items: QuizListItem[] = [];
    for (const quiz of quizzes) {
      const questionCount = await this.questionRepo.count({ where: { quizId: quiz.id } });
      items.push({ quiz, questionCount });
    }

    return { items, total };
  }

  findById(id: number): Promise<Quiz | null> {
    return this.quizRepo.findOne({ where: { id } });
  }

  findQuestionsByQuizId(quizId: number): Promise<Question[]> {
    return this.questionRepo.find({
      where: { quizId },
      order: { orderIndex: 'ASC', id: 'ASC' },
    });
  }
}

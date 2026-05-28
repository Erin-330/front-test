import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { QuizDetailResponseDto } from './dto/quiz-detail-response.dto';
import { QuizListQueryDto } from './dto/quiz-list-query.dto';
import { QuizListResponseDto } from './dto/quiz-response.dto';
import { QuizService } from './quiz.service';

@Controller('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Public()
  @Get()
  list(@Query() query: QuizListQueryDto): Promise<QuizListResponseDto> {
    return this.quizService.list(query);
  }

  @Public()
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<QuizDetailResponseDto> {
    return this.quizService.findById(id);
  }
}

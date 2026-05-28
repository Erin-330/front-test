import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  CurrentUser,
  CurrentUserPayload,
} from '../../common/decorators/current-user.decorator';
import { AttemptService } from './attempt.service';
import { AttemptDetailResponseDto } from './dto/attempt-detail-response.dto';
import { AttemptListResponseDto } from './dto/attempt-summary-response.dto';
import { CreateAttemptResponseDto } from './dto/create-attempt-response.dto';
import { CreateAttemptDto } from './dto/create-attempt.dto';
import { ListAttemptsQueryDto } from './dto/list-attempts-query.dto';

@Controller()
export class AttemptController {
  constructor(private readonly attemptService: AttemptService) {}

  @Post('quizzes/:quizId/attempts')
  @HttpCode(HttpStatus.CREATED)
  submit(
    @Param('quizId', ParseIntPipe) quizId: number,
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateAttemptDto,
  ): Promise<CreateAttemptResponseDto> {
    return this.attemptService.submit(quizId, user.id, dto);
  }

  @Get('attempts')
  list(
    @CurrentUser() user: CurrentUserPayload,
    @Query() query: ListAttemptsQueryDto,
  ): Promise<AttemptListResponseDto> {
    return this.attemptService.list(user.id, query);
  }

  @Get('attempts/:id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<AttemptDetailResponseDto> {
    return this.attemptService.findById(id, user.id);
  }
}

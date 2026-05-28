import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';

export class AttemptAnswerInputDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  questionId!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  selectedIndex!: number;
}

export class CreateAttemptDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AttemptAnswerInputDto)
  answers!: AttemptAnswerInputDto[];
}

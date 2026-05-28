export class QuestionResponseDto {
  id!: number;
  prompt!: string;
  choices!: string[];
  orderIndex!: number;
}

export class QuizDetailResponseDto {
  id!: number;
  title!: string;
  description?: string | null;
  category?: string | null;
  difficulty?: string | null;
  questions!: QuestionResponseDto[];
  createdAt!: Date;
  updatedAt!: Date;
}

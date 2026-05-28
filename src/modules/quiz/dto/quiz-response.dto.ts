export class QuizResponseDto {
  id!: number;
  title!: string;
  description?: string | null;
  category?: string | null;
  difficulty?: string | null;
  questionCount!: number;
  createdAt!: Date;
  updatedAt!: Date;
}

export class QuizListResponseDto {
  items!: QuizResponseDto[];
  total!: number;
  page!: number;
  limit!: number;
}

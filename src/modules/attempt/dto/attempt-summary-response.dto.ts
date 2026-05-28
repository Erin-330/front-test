export class AttemptSummaryResponseDto {
  id!: number;
  quizId!: number;
  quizTitle!: string;
  score!: number;
  totalQuestions!: number;
  correctCount!: number;
  submittedAt!: Date;
}

export class AttemptListResponseDto {
  items!: AttemptSummaryResponseDto[];
  total!: number;
  page!: number;
  limit!: number;
}

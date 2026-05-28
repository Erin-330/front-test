export class AnsweredQuestionDto {
  questionId!: number;
  selectedIndex!: number;
  correctIndex!: number;
  isCorrect!: boolean;
  explanation?: string | null;
}

export class CreateAttemptResponseDto {
  id!: number;
  quizId!: number;
  score!: number;
  totalQuestions!: number;
  correctCount!: number;
  submittedAt!: Date;
  answers!: AnsweredQuestionDto[];
}

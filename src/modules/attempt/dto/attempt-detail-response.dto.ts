export class AttemptDetailAnswerDto {
  questionId!: number;
  prompt!: string;
  choices!: string[];
  selectedIndex!: number;
  correctIndex!: number;
  isCorrect!: boolean;
  explanation?: string | null;
}

export class AttemptDetailResponseDto {
  id!: number;
  quizId!: number;
  quizTitle!: string;
  score!: number;
  totalQuestions!: number;
  correctCount!: number;
  submittedAt!: Date;
  answers!: AttemptDetailAnswerDto[];
}

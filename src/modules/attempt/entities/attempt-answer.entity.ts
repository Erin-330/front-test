import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from '../../quiz/entities/question.entity';
import { Attempt } from './attempt.entity';

@Entity({ name: 'attempt_answers' })
export class AttemptAnswer {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Index()
  @Column({ name: 'attempt_id', type: 'bigint' })
  attemptId!: number;

  @ManyToOne(() => Attempt, (a) => a.answers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'attempt_id' })
  attempt?: Attempt;

  @Column({ name: 'question_id', type: 'bigint' })
  questionId!: number;

  @ManyToOne(() => Question, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question?: Question;

  @Column({ name: 'selected_index', type: 'int' })
  selectedIndex!: number;

  @Column({ name: 'is_correct', type: 'boolean', default: false })
  isCorrect!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}

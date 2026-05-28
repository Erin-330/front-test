import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Quiz } from '../../quiz/entities/quiz.entity';
import { AttemptAnswer } from './attempt-answer.entity';

@Entity({ name: 'attempts' })
export class Attempt {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Index()
  @Column({ name: 'quiz_id', type: 'bigint' })
  quizId!: number;

  @ManyToOne(() => Quiz, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quiz_id' })
  quiz?: Quiz;

  @Index()
  @Column({ name: 'user_id', type: 'bigint' })
  userId!: number;

  @Column({ type: 'int', default: 0 })
  score!: number;

  @Column({ name: 'total_questions', type: 'int', default: 0 })
  totalQuestions!: number;

  @Column({ name: 'correct_count', type: 'int', default: 0 })
  correctCount!: number;

  @Column({ name: 'submitted_at', type: 'timestamptz', default: () => 'now()' })
  submittedAt!: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @OneToMany(() => AttemptAnswer, (a) => a.attempt, { cascade: true })
  answers?: AttemptAnswer[];
}

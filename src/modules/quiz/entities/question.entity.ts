import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Quiz } from './quiz.entity';

@Entity({ name: 'questions' })
export class Question {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Index()
  @Column({ name: 'quiz_id', type: 'bigint' })
  quizId!: number;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quiz_id' })
  quiz!: Quiz;

  @Column({ type: 'text' })
  prompt!: string;

  @Column({ type: 'jsonb' })
  choices!: string[];

  @Column({ name: 'correct_index', type: 'int' })
  correctIndex!: number;

  @Column({ type: 'text', nullable: true })
  explanation?: string | null;

  @Column({ name: 'order_index', type: 'int', default: 0 })
  orderIndex!: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}

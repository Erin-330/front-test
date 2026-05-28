import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateQuestionsTable1716800001000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'questions',
        columns: [
          { name: 'id', type: 'bigserial', isPrimary: true },
          { name: 'quiz_id', type: 'bigint', isNullable: false },
          { name: 'prompt', type: 'text', isNullable: false },
          { name: 'choices', type: 'jsonb', isNullable: false },
          { name: 'correct_index', type: 'int', isNullable: false },
          { name: 'explanation', type: 'text', isNullable: true },
          { name: 'order_index', type: 'int', isNullable: false, default: 0 },
          {
            name: 'created_at',
            type: 'timestamptz',
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            isNullable: false,
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'questions',
      new TableForeignKey({
        columnNames: ['quiz_id'],
        referencedTableName: 'quizzes',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'questions',
      new TableIndex({
        name: 'IDX_questions_quiz_id',
        columnNames: ['quiz_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('questions');
  }
}

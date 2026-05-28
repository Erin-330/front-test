import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateAttemptsTable1716800002000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'attempts',
        columns: [
          { name: 'id', type: 'bigserial', isPrimary: true },
          { name: 'quiz_id', type: 'bigint', isNullable: false },
          { name: 'user_id', type: 'bigint', isNullable: false },
          { name: 'score', type: 'int', isNullable: false, default: 0 },
          { name: 'total_questions', type: 'int', isNullable: false, default: 0 },
          { name: 'correct_count', type: 'int', isNullable: false, default: 0 },
          {
            name: 'submitted_at',
            type: 'timestamptz',
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            isNullable: false,
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'attempts',
      new TableForeignKey({
        columnNames: ['quiz_id'],
        referencedTableName: 'quizzes',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'attempts',
      new TableIndex({
        name: 'IDX_attempts_user_id',
        columnNames: ['user_id'],
      }),
    );

    await queryRunner.createIndex(
      'attempts',
      new TableIndex({
        name: 'IDX_attempts_quiz_id',
        columnNames: ['quiz_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('attempts');
  }
}

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateAttemptAnswersTable1716800003000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'attempt_answers',
        columns: [
          { name: 'id', type: 'bigserial', isPrimary: true },
          { name: 'attempt_id', type: 'bigint', isNullable: false },
          { name: 'question_id', type: 'bigint', isNullable: false },
          { name: 'selected_index', type: 'int', isNullable: false },
          { name: 'is_correct', type: 'boolean', isNullable: false, default: false },
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
      'attempt_answers',
      new TableForeignKey({
        columnNames: ['attempt_id'],
        referencedTableName: 'attempts',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'attempt_answers',
      new TableForeignKey({
        columnNames: ['question_id'],
        referencedTableName: 'questions',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'attempt_answers',
      new TableIndex({
        name: 'IDX_attempt_answers_attempt_id',
        columnNames: ['attempt_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('attempt_answers');
  }
}

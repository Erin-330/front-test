import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateQuizzesTable1716800000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'quizzes',
        columns: [
          {
            name: 'id',
            type: 'bigserial',
            isPrimary: true,
          },
          { name: 'title', type: 'varchar', length: '255', isNullable: false },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'category', type: 'varchar', length: '64', isNullable: true },
          { name: 'difficulty', type: 'varchar', length: '32', isNullable: true },
          {
            name: 'is_published',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('quizzes');
  }
}

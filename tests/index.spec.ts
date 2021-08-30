import mysql from 'mysql2/promise';

const password = process.env.DATABASE_PASSWORD || '123456';
const port = process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306;

describe('Test Database', () => {
  let connection: mysql.Connection;

  beforeAll(async () => {
    connection = await mysql.createConnection({
      host: 'localhost',
      port,
      user: 'root',
      password,
      database: 'test',
    });
    await connection.execute('DROP TABLE IF EXISTS `users`');
  });

  afterAll(async () => {
    if (connection) {
      await connection.destroy();
    }
  });

  test('create table `users`', async () => {
    const [tables_1] = await connection.execute(`SHOW TABLES`);
    expect((tables_1 as any).length).toEqual(0);

    await connection.execute(
      'CREATE TABLE `users` (' +
        '`id` INT(32) NOT NULL AUTO_INCREMENT,' +
        '`first_name` VARCHAR(32) NOT NULL,' +
        '`last_name` VARCHAR(32) NOT NULL,' +
        '`age` TINYINT(2) DEFAULT 1,' +
        'PRIMARY KEY (`id`)' +
        ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4',
    );
    const [tables_2] = await connection.execute(`SHOW TABLES`);
    expect((tables_2 as any).length).toEqual(1);
  });
});

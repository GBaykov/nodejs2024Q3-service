import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'admin',
  password: 'password',
  database: 'postgres',
  entities: ['src/**/*.entity{.js,.ts}'],
  migrations: ['src/**/migrations/*.js'],
};

export default new DataSource(dataSourceOptions);

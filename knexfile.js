require('dotenv').config()

module.exports = {
  developmentLocal: {
    client: 'postgresql',
    connection: {
      host: process.env.DEV_DB_HOST,
      user: process.env.DEV_DB_USER,
      database: 'homework-club',
      password: process.env.DEV_DB_PASS,
      port: 5432,
    },
    migrations: {
      directory: `${__dirname}/src/knex/migrations`,
    },
    seeds: {
      directory: `${__dirname}/src/knex/seeds`,
    },
  },
  development: {
    client: 'postgresql',
    connection: {
      connectionString: process.env.API_URL,
      connectionTimeoutMillis: 5000,
      ssl: {
        rejectUnauthorized: false,
      },
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: `${__dirname}/src/knex/migrations`,
    },
    seeds: {
      directory: `${__dirname}/src/knex/seeds`,
    },
  },
  production: {
    client: 'postgresql',
    connection: {
      connectionString: process.env.DATABASE_URL,
      connectionTimeoutMillis: 5000,
      ssl: {
        rejectUnauthorized: false,
      },
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: `${__dirname}/src/knex/migrations`,
    },
    seeds: {
      directory: `${__dirname}/src/knex/seeds`,
    },
  },
}

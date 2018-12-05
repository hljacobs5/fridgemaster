// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/fridgemaster',
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds/dev',
    },
    useNullAsDefault: true,
  },
  testing: {
    client: 'pg',
    connection: 'postgres://localhost/testmaster',
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds/testing',
    },
    useNullAsDefault: true,
  },
};

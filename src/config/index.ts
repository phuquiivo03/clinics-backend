export const config = {
  nosqlDb: {
    type: process.env.NOSQL_DB_TYPE,
    port: process.env.NOSQL_DB_PORT,
    host: process.env.NOSQL_DB_HOST,
    user: process.env.NOSQL_DB_USER,
    password: process.env.NOSQL_DB_PASSWORD,
    name: process.env.NOSQL_DB_NAME,
  },
  cookie: {
    secret: process.env.COOKIE_SECRET || 'default_secret',
    maxAge: parseInt(process.env.COOKIE_MAX_AGE || '60000'),
  },
  redis: {
    // url: `${process.env.REDIS_URL}:${process.env.REDIS_PORT}`,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    host: process.env.REDIS_URL,
    port: parseInt(process.env.REDIS_PORT || '13992'),
  },
  app: {
    pagination: {
      defaultPage: parseInt(process.env.PAGINATION_DEFAULT_PAGE || '1'),
      defaultLimit: parseInt(process.env.PAGINATION_DEFAULT_LIMIT || '10'),
    },
  },
};

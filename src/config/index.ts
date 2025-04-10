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
};

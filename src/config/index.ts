import type { Config } from './types';

export const config: Config = {
  nosqlDb: {
    type: process.env.NOSQL_DB_TYPE,
    port: process.env.NOSQL_DB_PORT,
    host: process.env.NOSQL_DB_HOST,
    user: process.env.NOSQL_DB_USER,
    password: process.env.NOSQL_DB_PASSWORD,
    name: process.env.NOSQL_DB_NAME,
  },
  jwt: {
    authen: {
      secret: process.env.JWT_SECRET || 'default_secret',
      expiresIn: process.env.JWT_EXPIRED || '10m',
    },
    refresh: {
      secret: process.env.JWT_REFRESH_SECRET || 'default_secret',
      expiresIn: process.env.JWT_REFRESH_EXPIRED || '30d',
    },
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
    cache: {
      expireTime: 60,
      phoneNumberVerified: 60 * 5, // 5 minutes
      refreshToken: 60 * 60 * 24 * 30, // 30 days
      authenToken: 60 * 10, // 10 minutes
      usedRefreshTokenTTL: 60 * 5, // 5 minutes, for the set of used tokens
    },
    key: {
      phoneNumberVerified: (phoneNumber: string) => {
        return `verified_${phoneNumber}`;
      },
      refreshToken: (userId: string) => {
        return `refresh_${userId}`;
      },
      usedRefreshTokensSet: (userId: string) => {
        // New key for the set of used refresh tokens
        return `used_rt_set:${userId}`;
      },
      authenToken: (authenToken: string) => {
        return `blacklist_authen_${authenToken}`;
      },
    },
  },
  app: {
    pagination: {
      defaultPage: parseInt(process.env.PAGINATION_DEFAULT_PAGE || '1'),
      defaultLimit: parseInt(process.env.PAGINATION_DEFAULT_LIMIT || '10'),
    },
  },

  pinata: {
    jwt: process.env.PINATA_JWT || '',
    gateway: process.env.GATEWAY_URL || '',
    viewUrl: 'https://turquoise-dear-mole-333.mypinata.cloud/ipfs/',
  },
  customPackage: process.env.CUSTOM_PACKAGE || '68564f4d14037ab8fa3e2ddc',
};

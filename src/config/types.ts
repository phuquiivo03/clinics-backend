export interface NosqlDbConfig {
  type: string | undefined;
  port: string | undefined;
  host: string | undefined;
  user: string | undefined;
  password: string | undefined;
  name: string | undefined;
}

export interface JwtAuthenConfig {
  secret: string;
  expiresIn: string;
}

export interface JwtRefreshConfig {
  secret: string;
  expiresIn: string;
}

export interface JwtConfig {
  authen: JwtAuthenConfig;
  refresh: JwtRefreshConfig;
}

export interface CookieConfig {
  secret: string;
  maxAge: number;
}

export interface RedisCacheConfig {
  expireTime: number;
  phoneNumberVerified: number;
  refreshToken: number;
  authenToken: number;
}

export interface RedisKeyConfig {
  phoneNumberVerified: (phoneNumber: string) => string;
  refreshToken: (userId: string) => string;
  authenToken: (authenToken: string) => string;
}

export interface RedisConfig {
  username: string | undefined;
  password: string | undefined;
  host: string | undefined;
  port: number;
  cache: RedisCacheConfig;
  key: RedisKeyConfig;
}

export interface PaginationConfig {
  defaultPage: number;
  defaultLimit: number;
}

export interface AppConfig {
  pagination: PaginationConfig;
}

export interface Config {
  nosqlDb: NosqlDbConfig;
  jwt: JwtConfig;
  cookie: CookieConfig;
  redis: RedisConfig;
  app: AppConfig;
  pinata: PinataConfig;
}

export interface PinataConfig {
  jwt: string;
  gateway: string;
  viewUrl: string;
}

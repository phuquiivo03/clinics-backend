import { createClient } from 'redis';
import { config } from '../config';

// redis setup
const client = await createClient({
  url: config.redis.url,
})
  .on('error', (err) => console.log('Redis Client Error', err))
  .connect();

export default client;

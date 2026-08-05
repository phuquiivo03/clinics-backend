import { createClient } from 'redis';
import { config } from '../config';



// redis setup
const client = await createClient({
  socket: {
    host: config.redis.host,
    port: config.redis.port,
  },
  username: config.redis.username,
  password: config.redis.password,
})
  .on('error', (err) => console.log('Redis Client Error', (err as Error).message))
  .connect();

export default client;

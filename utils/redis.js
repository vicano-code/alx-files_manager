import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.client.on('error', (err) => {
        console.log(`Redis Client Error: ${err.message}`)
    });
    this.client.on('connect', () => {
      // console.log('Redis client connected');
    });
  }

  // Check if Redis is connected
  isAlive() {
    return this.client.connected; 
  }

  // Gets value corresponding to key in redis
  async get(key) {
    const value = await this.getAsync(key);
    return value;
  }

  // Creates a new key in redis with a specific duration
  async set(key, value, duration) {
    this.client.setex(key, duration, value);
  }

  // Deletes key in redis service
  async del(key) {
    this.client.del(key);
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
module.exports = redisClient;

import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.on('error', (err) => {
        console.log('Redis Client Error', err)
    });
  }

  isAlive() {
    return this.client.connected; // Check if Redis is connected
  }

  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, value) => {
        if (err) {
          reject(err);
        } else {
          resolve(value);
        }
      });
    });
  }

  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, duration, value, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient;
export default redisClient;

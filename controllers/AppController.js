// controllers/AppController.js
import redisClient from '../utils/redis.js'; // Redis client
import dbClient from '../utils/mongodb.js'; // MongoDB client

class AppController {
  // GET /status
  static async getStatus(req, res) {
    const redisAlive = redisClient.isAlive();
    const dbAlive = await dbClient.isAlive();

    return res.status(200).json({redis: redisAlive, db: dbAlive});
  }

  // GET /stats
  static async getStats(req, res) {
    try {
      const usersCount = await dbClient.nbUsers(); // Count users
      const filesCount = await dbClient.nbFiles(); // Count files

      return res.status(200).json({ users: usersCount, files: filesCount })
    } catch (err) {
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  }
}
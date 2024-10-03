// controllers/AppController.js
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  // Get connection status of redisClient and dbClient
  static async getStatus(req, res) {
    try {
      const redisAlive = redisClient.isAlive();
      const dbAlive = await dbClient.isAlive();

      return res.status(200).json({ redis: redisAlive, db: dbAlive });
    } catch (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Get number of users and files in DB
  static async getStats(req, res) {
    try {
      const usersCount = await dbClient.nbUsers(); // Count users
      const filesCount = await dbClient.nbFiles(); // Count files

      return res.status(200).json({ users: usersCount, files: filesCount });
    } catch (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = AppController;

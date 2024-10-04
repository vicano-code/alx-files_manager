const {ObjectId} = require('mongodb');
import sha1 from 'sha1';
import dbClient from '../utils/db'; // MongoDB client
import redisClient from '../utils/redis';

class UsersController {
  static async postNew(req, res) {
    try {
      const { email, password } = req.body;
      // Validate email and password
      if (!email) return res.status(400).send({ error: 'Missing email' });
      if (!password) return res.status(400).json({ error: 'Missing password' });

      // Check if email already exists in DB
      const existingUser = await dbClient.users.findOne({ email });
      if (existingUser) return res.status(400).json({ error: 'Already exist' });

      // Hash password using SHA1
      const hashedPassword = sha1(password);

      // Create a new user
      const newUser = { email, password: hashedPassword };
      const result = await dbClient.users.insertOne(newUser);
      return res.status(200).send(result);
    } catch (err) {
      // console.error('Error in postNew:', err);
      return res.status(500).send({ error: 'Error creating user' });
    }
  }

  // Retrieve the user based on the token
  static async getMe(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const tokenKey = `auth_${token}`;

    try {
      const userId = await redisClient.get(tokenKey);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const userObj = { _id: new ObjectId(userId) };
      const projection = { projection: { email: 1 } };
      const user = await dbClient.users.findOne(userObj, projection);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      return res.status(200).json({ id: user._id, email: user.email });
    } catch (err) {
      console.error('Error retrieving user:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = UsersController;

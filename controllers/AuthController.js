const sha1 = require('sha1');
const { v4: uuidv4 } = require('uuid');
const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

// AuthController
class AuthController {
  // Sign-in the user and generate a new token
  static async getConnect(req, res) {
    const authHeader = req.header('Authorization') || '';
    const base64Credentials = authHeader.split(' ')[1];
    if (!base64Credentials) return res.status(401).send({ error: 'Unauthorized' });
    const decodedCredentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [email, password] = decodedCredentials.split(':');

    // Find the user with email and SHA1 hashed password
    const user = await dbClient.users.findOne({ email, password: sha1(password) });

    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    // Generate a token and store it in Redis
    const token = uuidv4();
    const tokenKey = `auth_${token}`;
    await redisClient.set(tokenKey, user._id.toString(), 24 * 60 * 60); // Store token for 24 hours

    return res.status(200).json({ token });
  }

  // Sign-out the user and delete the token
  static async getDisconnect(req, res) {
    // Retrieve the user from the token
    const token = req.headers['x-token'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const tokenKey = `auth_${token}`;
    const userId = await redisClient.get(tokenKey);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // Delete the token in Redis
    await redisClient.del(tokenKey);

    return res.status(204).send();
  }
}

module.exports = AuthController;

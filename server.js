import express from 'express';
import routes from './routes/index';

const app = express();
const PORT = process.env.DB_PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Use the routes
app.use('/', routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

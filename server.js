const express = require('express');
const routes = require('./routes/index');

const app = express();
const PORT = process.env.DB_PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Use the routes
app.use('/', routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
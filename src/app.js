const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Export the app instance for use in index.js
module.exports = app;

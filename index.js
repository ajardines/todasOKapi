require('dotenv').config();
const express = require('express');
const router = require('./src/routes');
const ErrorHandler = require('./src/common/middleware/ErrorHandler');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api', router);

app.use(ErrorHandler.handler);

app.listen(process.env.PORT, () => {
  console.log(`todasOK Running... on port ${process.env.PORT}`);
});

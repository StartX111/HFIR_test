require('dotenv').config()
const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();
const router = express.Router();
const apiRoute = require('./routers/api');
const PORT = 3000;

app.use(cors());

app.use(express.static(path.join(__dirname, './../../frontend/dist')));

app.use(express.json({ limit: '50mb' }));

app.use('/', router);
app.use('/api', apiRoute);

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './../../frontend/dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
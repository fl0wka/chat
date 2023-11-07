const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Ответ с сервера');
});

module.exports = router;

const express = require('express');

const router = express.Router();
const CONSTANTS = require('../constants');
const potterApi = require('../services/potterApi');

router.post('/cpu-deck', async (req, res) => {
  try {
    const deck = await potterApi.fetchPack(CONSTANTS.CPU_DECK_SIZE);
    res.json({ deck });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'erro ao montar deck cpu' });
  }
});

module.exports = router;

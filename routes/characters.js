const express = require('express');

const router = express.Router();
const CONSTANTS = require('../constants');
const potterApi = require('../services/potterApi');

router.get('/pack', async (req, res) => {
  try {
    const cards = await potterApi.fetchPack(CONSTANTS.PACK_SIZE);
    res.json({ cards });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'erro ao buscar personagens' });
  }
});

module.exports = router;

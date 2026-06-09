const express = require('express');

const router = express.Router();
const CONSTANTS = require('../constants');
const potterApi = require('../services/potterApi');

router.get('/spells', async (req, res) => {
  try {
    const spells = await potterApi.fetchSpells(CONSTANTS.SPELLS_COUNT);
    res.json({ spells });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'erro ao buscar feiticos' });
  }
});

module.exports = router;

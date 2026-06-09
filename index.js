const express = require('express');
const charactersRoute = require('./routes/characters');
const gameRoute = require('./routes/game');
const spellsRoute = require('./routes/spells');

const app = express();
app.use(express.static('public'));
app.use(express.json());

app.use('/api', charactersRoute);
app.use('/api', gameRoute);
app.use('/api', spellsRoute);

app.listen(3000, () => {
  console.error('rodando na porta 3000');
});

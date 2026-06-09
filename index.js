const express = require('express');
const CONSTANTS = require('./constants');
const fetch = require('node-fetch');

const app = express();
app.use(express.static('public'));
app.use(express.json());

// ---------------------------------------------------------
// FUNÇÕES AUXILIARES (HELPERS)
// ---------------------------------------------------------

function shuffleArray(array) {
  const arr = [...array];
  for (let currentIndex = arr.length - 1; currentIndex > 0; currentIndex--) {
    const randomIndex = Math.floor(Math.random() * (currentIndex + 1));
    const temporaryValue = arr[currentIndex]; arr[currentIndex] = arr[randomIndex]; arr[randomIndex] = temporaryValue;
  }
  return arr;
}

function formatCharacter(character) {
  const attributes = character.attributes;
  if (!attributes.name || attributes.name === '' || !attributes.image) return null;

  let power = 50;
  if (attributes.house === 'Gryffindor') power = 90;
  if (attributes.house === 'Slytherin') power = 85;
  if (attributes.house === 'Hufflepuff') power = 75;
  if (attributes.house === 'Ravenclaw') power = 80;

  let magic = 50;
  if (attributes.species === 'human') magic = 70;
  if (attributes.species === 'half-giant') magic = 88;
  if (attributes.species === 'giant') magic = 95;
  if (attributes.species === 'house elf') magic = 82;
  if (attributes.species === 'ghost') magic = 60;
  if (attributes.species === 'werewolf') magic = 91;
  if (attributes.species === 'vampire') magic = 87;
  if (attributes.species === 'centaur') magic = 78;

  let defense = 50;
  if (attributes.ancestry === 'pure-blood') defense = 90;
  if (attributes.ancestry === 'half-blood') defense = 75;
  if (attributes.ancestry === 'muggle-born') defense = 70;
  if (attributes.ancestry === 'muggle') defense = 40;
  if (attributes.ancestry === 'squib') defense = 35;

  let hp = defense + Math.floor(Math.random() * 20) + 80;

  return {
    id: character.id,
    name: attributes.name,
    house: attributes.house || 'Unknown',
    species: attributes.species || 'Unknown',
    ancestry: attributes.ancestry || 'Unknown',
    image: attributes.image,
    power: power,
    magic: magic,
    defense: defense,
    hp: hp,
    maxHp: hp
  };
}

function formatSpell(spell) {
  const attributes = spell.attributes;
  if (!attributes.name || attributes.name === '') return null;

  let spellDamage = 30;
  if (attributes.category === 'Charm') spellDamage = 45;
  if (attributes.category === 'Curse') spellDamage = 90;
  if (attributes.category === 'Hex') spellDamage = 65;
  if (attributes.category === 'Jinx') spellDamage = 55;
  if (attributes.category === 'Spell') spellDamage = 50;
  if (attributes.category === 'Transfiguration') spellDamage = 40;
  if (attributes.category === 'Counter-spell') spellDamage = 35;
  if (attributes.category === 'Healing spell') spellDamage = -40;

  return {
    id: spell.id,
    name: attributes.name,
    effect: attributes.effect || 'Efeito desconhecido',
    category: attributes.category || 'Spell',
    light: attributes.light || 'Unknown',
    damage: spellDamage
  };
}

// ---------------------------------------------------------
// ROTAS DA API
// ---------------------------------------------------------

app.get('/api/pack', async (req, res) => {
  try {
    const pageNumber = Math.floor(Math.random() * CONSTANTS.API_MAX_PAGE) + 1;
    const apiResponse = await fetch('https://api.potterdb.com/v1/characters?page[size]=${CONSTANTS.API_PAGE_SIZE}&page[number]=' + pageNumber);
    const jsonData = await apiResponse.json();

    let itemList = jsonData.data.map(formatCharacter).filter(char => char !== null);
    itemList = shuffleArray(itemList);

    res.json({ cards: itemList.slice(0, 4) });
  } catch(e) {
    console.log(e);
    res.status(500).json({ error: 'erro ao buscar personagens' });
  }
});

app.get('/api/spells', async (req, res) => {
  try {
    const apiResponse = await fetch('https://api.potterdb.com/v1/spells?page[size]=${CONSTANTS.API_PAGE_SIZE}');
    const jsonData = await apiResponse.json();

    let itemList = jsonData.data.map(formatSpell).filter(spell => spell !== null);
    itemList = shuffleArray(itemList);

    res.json({ spells: itemList.slice(0, 20) });
  } catch(e) {
    console.log(e);
    res.status(500).json({ error: 'erro ao buscar feiticos' });
  }
});

app.post('/api/cpu-deck', async (req, res) => {
  try {
    const pageNumber = Math.floor(Math.random() * CONSTANTS.API_MAX_PAGE) + 1;
    const apiResponse = await fetch('https://api.potterdb.com/v1/characters?page[size]=${CONSTANTS.API_PAGE_SIZE}&page[number]=' + pageNumber);
    const jsonData = await apiResponse.json();

    let itemList = jsonData.data.map(formatCharacter).filter(char => char !== null);
    itemList = shuffleArray(itemList);

    res.json({ deck: itemList.slice(0, 2) });
  } catch(e) {
    console.log(e);
    res.status(500).json({ error: 'erro ao montar deck cpu' });
  }
});

app.listen(3000, () => {
  console.log('rodando na porta 3000');
});

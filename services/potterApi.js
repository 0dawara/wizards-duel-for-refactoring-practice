const fetch = require('node-fetch');
const CONSTANTS = require('../constants');
const { formatCharacter, formatSpell } = require('./statsCalculator');
const shuffleArray = require('../utils/shuffle');

async function fetchPack(size) {
  const pageNumber = Math.floor(Math.random() * CONSTANTS.API_MAX_PAGE) + 1;
  const apiResponse = await fetch(`https://api.potterdb.com/v1/characters?page[size]=${CONSTANTS.API_PAGE_SIZE}&page[number]=${pageNumber}`);
  const jsonData = await apiResponse.json();

  let itemList = jsonData.data.map(formatCharacter).filter((char) => char !== null);
  itemList = shuffleArray(itemList);
  return itemList.slice(0, size);
}

async function fetchSpells(size) {
  const apiResponse = await fetch(`https://api.potterdb.com/v1/spells?page[size]=${CONSTANTS.API_PAGE_SIZE}`);
  const jsonData = await apiResponse.json();

  let itemList = jsonData.data.map(formatSpell).filter((spell) => spell !== null);
  itemList = shuffleArray(itemList);
  return itemList.slice(0, size);
}

module.exports = { fetchPack, fetchSpells };

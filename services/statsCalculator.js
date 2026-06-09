const CONSTANTS = require('../constants');

function formatCharacter(character) {
  const { attributes } = character;
  if (!attributes.name || attributes.name === '' || !attributes.image) return null;

  const power = CONSTANTS.HOUSE_POWER[attributes.house] || CONSTANTS.BASE_POWER;
  const magic = CONSTANTS.SPECIES_MAGIC[attributes.species] || CONSTANTS.BASE_MAGIC;
  const defense = CONSTANTS.ANCESTRY_DEFENSE[attributes.ancestry] || CONSTANTS.BASE_DEFENSE;

  const hp = defense + Math.floor(Math.random() * CONSTANTS.HP_RANDOM_BONUS) + CONSTANTS.BASE_HP;

  return {
    id: character.id,
    name: attributes.name,
    house: attributes.house || 'Unknown',
    species: attributes.species || 'Unknown',
    ancestry: attributes.ancestry || 'Unknown',
    image: attributes.image,
    power,
    magic,
    defense,
    hp,
    maxHp: hp,
  };
}

function formatSpell(spell) {
  const { attributes } = spell;
  if (!attributes.name || attributes.name === '') return null;

  const spellDamage = CONSTANTS.SPELL_DAMAGE[attributes.category] || CONSTANTS.BASE_SPELL_DAMAGE;

  return {
    id: spell.id,
    name: attributes.name,
    effect: attributes.effect || 'Efeito desconhecido',
    category: attributes.category || 'Spell',
    light: attributes.light || 'Unknown',
    damage: spellDamage,
  };
}

module.exports = { formatCharacter, formatSpell };

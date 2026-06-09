const CONSTANTS = {
  // API Pagination
  API_PAGE_SIZE: 100,
  API_MAX_PAGE: 8,

  // Deck / Game Sizes
  PACK_SIZE: 4,
  CPU_DECK_SIZE: 2,
  SPELLS_COUNT: 20,

  // Base Attributes
  BASE_POWER: 50,
  BASE_MAGIC: 50,
  BASE_DEFENSE: 50,
  BASE_HP: 80,
  HP_RANDOM_BONUS: 20,

  // House Power Modifiers
  HOUSE_POWER: {
    Gryffindor: 90,
    Slytherin: 85,
    Hufflepuff: 75,
    Ravenclaw: 80
  },

  // Species Magic Modifiers
  SPECIES_MAGIC: {
    human: 70,
    'half-giant': 88,
    giant: 95,
    'house elf': 82,
    ghost: 60,
    werewolf: 91,
    vampire: 87,
    centaur: 78
  },

  // Ancestry Defense Modifiers
  ANCESTRY_DEFENSE: {
    'pure-blood': 90,
    'half-blood': 75,
    'muggle-born': 70,
    muggle: 40,
    squib: 35
  },

  // Spell Damage Modifiers
  BASE_SPELL_DAMAGE: 30,
  SPELL_DAMAGE: {
    Charm: 45,
    Curse: 90,
    Hex: 65,
    Jinx: 55,
    Spell: 50,
    Transfiguration: 40,
    'Counter-spell': 35,
    'Healing spell': -40
  }
};

module.exports = CONSTANTS;

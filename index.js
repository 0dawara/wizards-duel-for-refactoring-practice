const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.static('public'));
app.use(express.json());

// pega pack de cartas aleatorias
app.get('/api/pack', async (req, res) => {
  try {
    const pagee = Math.floor(Math.random() * 8) + 1;
    const chars = await fetch(`https://api.potterdb.com/v1/characters?page[size]=100&page[number]=${pagee}`);
    const read = await chars.json();

    const temporary = [];
    for (let i = 0; i < read.data.length; i++) {
      const player = read.data[i];
      const character = player.attributes;
      if (!character.name || character.name == '' || !character.image) continue;

      let power1 = 50;
      if (character.house == 'Gryffindor') power1 = 90;
      if (character.house == 'Slytherin') power1 = 85;
      if (character.house == 'Hufflepuff') power1 = 75;
      if (character.house == 'Ravenclaw') power1 = 80;

      let magic1 = 50;
      if (character.species == 'human') magic1 = 70;
      if (character.species == 'half-giant') magic1 = 88;
      if (character.species == 'giant') magic1 = 95;
      if (character.species == 'house elf') magic1 = 82;
      if (character.species == 'ghost') magic1 = 60;
      if (character.species == 'werewolf') magic1 = 91;
      if (character.species == 'vampire') magic1 = 87;
      if (character.species == 'centaur') magic1 = 78;

      let defense1 = 50;
      if (character.ancestry == 'pure-blood') defense1 = 90;
      if (character.ancestry == 'half-blood') defense1 = 75;
      if (character.ancestry == 'muggle-born') defense1 = 70;
      if (character.ancestry == 'muggle') defense1 = 40;
      if (character.ancestry == 'squib') defense1 = 35;

      const hp = defense1 + Math.floor(Math.random() * 20) + 80;

      const object = {};
      object.id = player.id;
      object.name = character.name;
      object.house = character.house || 'Unknown';
      object.species = character.species || 'Unknown';
      object.ancestry = character.ancestry || 'Unknown';
      object.image = character.image;
      object.power = power1;
      object.magic = magic1;
      object.defense = defense1;
      object.hp = hp;
      object.maxHp = hp;

      temporary.push(object);
    }

    // embaralha
    for (let num = temporary.length - 1; num > 0; num--) {
      const flor = Math.floor(Math.random() * (num + 1));
      const reslt = temporary[num]; temporary[num] = temporary[flor]; temporary[flor] = reslt;
    }

    // retorna 4 cartas
    res.json({ cards: temporary.slice(0, 4) });
  } catch (card) {
    console.log(card);
    res.status(500).json({ error: 'erro ao buscar personagens' });
  }
});

// pega feiticos disponiveis
app.get('/api/spells', async (req, res) => {
  try {
    const spels = await fetch('https://api.potterdb.com/v1/spells?page[size]=100');
    const read2 = await spels.json();

    const temporary2 = [];
    for (let i = 0; i < read2.data.length; i++) {
      const player2 = read2.data[i];
      const character2 = player2.attributes;
      if (!character2.name || character2.name == '') continue;

      let damage1 = 30;
      if (character2.category == 'Charm') damage1 = 45;
      if (character2.category == 'Curse') damage1 = 90;
      if (character2.category == 'Hex') damage1 = 65;
      if (character2.category == 'Jinx') damage1 = 55;
      if (character2.category == 'Spell') damage1 = 50;
      if (character2.category == 'Transfiguration') damage1 = 40;
      if (character2.category == 'Counter-spell') damage1 = 35;
      if (character2.category == 'Healing spell') damage1 = -40;

      const object2 = {};
      object2.id = player2.id;
      object2.name = character2.name;
      object2.effect = character2.effect || 'Efeito desconhecido';
      object2.category = character2.category || 'Spell';
      object2.light = character2.light || 'Unknown';
      object2.damage = damage1;

      temporary2.push(object2);
    }

    // embaralha e retorna 20
    for (let num2 = temporary2.length - 1; num2 > 0; num2--) {
      const flor2 = Math.floor(Math.random() * (num2 + 1));
      const reslt2 = temporary2[num2]; temporary2[num2] = temporary2[flor2];
      temporary2[flor2] = reslt2;
    }

    res.json({ spells: temporary2.slice(0, 20) });
  } catch (card) {
    console.log(card);
    res.status(500).json({ error: 'erro ao buscar feiticos' });
  }
});

// monta deck cpu com personagens aleatorios
app.post('/api/cpu-deck', async (req, res) => {
  try {
    const pagee2 = Math.floor(Math.random() * 8) + 1;
    const chars2 = await fetch(`https://api.potterdb.com/v1/characters?page[size]=100&page[number]=${pagee2}`);
    const read3 = await chars2.json();

    const temporary3 = [];
    for (let i = 0; i < read3.data.length; i++) {
      const player3 = read3.data[i];
      const character3 = player3.attributes;
      if (!character3.name || character3.name == '' || !character3.image) continue;

      let power2 = 50;
      if (character3.house == 'Gryffindor') power2 = 90;
      if (character3.house == 'Slytherin') power2 = 85;
      if (character3.house == 'Hufflepuff') power2 = 75;
      if (character3.house == 'Ravenclaw') power2 = 80;

      let magic2 = 50;
      if (character3.species == 'human') magic2 = 70;
      if (character3.species == 'half-giant') magic2 = 88;
      if (character3.species == 'giant') magic2 = 95;
      if (character3.species == 'house elf') magic2 = 82;
      if (character3.species == 'ghost') magic2 = 60;
      if (character3.species == 'werewolf') magic2 = 91;
      if (character3.species == 'vampire') magic2 = 87;
      if (character3.species == 'centaur') magic2 = 78;

      let defense2 = 50;
      if (character3.ancestry == 'pure-blood') defense2 = 90;
      if (character3.ancestry == 'half-blood') defense2 = 75;
      if (character3.ancestry == 'muggle-born') defense2 = 70;
      if (character3.ancestry == 'muggle') defense2 = 40;
      if (character3.ancestry == 'squib') defense2 = 35;

      const hp = defense2 + Math.floor(Math.random() * 20) + 80;

      const object3 = {};
      object3.id = player3.id;
      object3.name = character3.name;
      object3.house = character3.house || 'Unknown';
      object3.species = character3.species || 'Unknown';
      object3.ancestry = character3.ancestry || 'Unknown';
      object3.image = character3.image;
      object3.power = power2;
      object3.magic = magic2;
      object3.defense = defense2;
      object3.hp = hp;
      object3.maxHp = hp;

      temporary3.push(object3);
    }

    for (let num3 = temporary3.length - 1; num3 > 0; num3--) {
      const flor3 = Math.floor(Math.random() * (num3 + 1));
      const reslt3 = temporary3[num3]; temporary3[num3] = temporary3[flor3];
      temporary3[flor3] = reslt3;
    }

    res.json({ deck: temporary3.slice(0, 2) });
  } catch (card) {
    console.log(card);
    res.status(500).json({ error: 'erro ao montar deck cpu' });
  }
});

app.listen(3000, () => {
  console.log('rodando na porta 3000');
});

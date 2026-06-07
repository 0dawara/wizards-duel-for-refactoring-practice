const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.static('public'));
app.use(express.json());

// pega pack de cartas aleatorias
app.get('/api/pack', async (req, res) => {
  try {
    const eight = 8;
    const pagee = Math.floor(Math.random() * eight) + 1;
    const chars = await fetch(`https://api.potterdb.com/v1/characters?page[size]=100&page[number]=${pagee}`);
    const read = await chars.json();

    const temporary = [];
    for (let i = 0; i < read.data.length; i++) {
      const player = read.data[i];
      const character = player.attributes;
      if (!character.name || character.name == '' || !character.image) continue;

      const basic = 50;

      let power1 = basic;
      const gryff = 90;
      const slythe = 85;
      const huffle = 75;
      const raven = 80;
      if (character.house == 'Gryffindor') power1 = gryff;
      if (character.house == 'Slytherin') power1 = slythe;
      if (character.house == 'Hufflepuff') power1 = huffle;
      if (character.house == 'Ravenclaw') power1 = raven;

      let magic1 = basic;
      const hum = 70;
      const halfg = 88;
      const gia = 95;
      const hoelf = 82;
      const gho = 60;
      const werew = 91;
      const vamp = 87;
      const centa = 78;
      if (character.species == 'human') magic1 = hum;
      if (character.species == 'half-giant') magic1 = halfg;
      if (character.species == 'giant') magic1 = gia;
      if (character.species == 'house elf') magic1 = hoelf;
      if (character.species == 'ghost') magic1 = gho;
      if (character.species == 'werewolf') magic1 = werew;
      if (character.species == 'vampire') magic1 = vamp;
      if (character.species == 'centaur') magic1 = centa;

      let defense1 = basic;
      const pureb = 90;
      const halfb = 75;
      const muggleb = 70;
      const mug = 40;
      const squi = 35;
      if (character.ancestry == 'pure-blood') defense1 = pureb;
      if (character.ancestry == 'half-blood') defense1 = halfb;
      if (character.ancestry == 'muggle-born') defense1 = muggleb;
      if (character.ancestry == 'muggle') defense1 = mug;
      if (character.ancestry == 'squib') defense1 = squi;

      const twenty = 20;
      const current = 80;
      const hp = defense1 + Math.floor(Math.random() * twenty) + current;

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
    const totalcards = 4;
    res.json({ cards: temporary.slice(0, totalcards) });
  } catch (card) {
    console.log(card);
    const errornum = 500;
    res.status(errornum).json({ error: 'erro ao buscar personagens' });
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

      const dmg = 30;

      let damage1 = dmg;
      const chrm = 45;
      const crse = 90;
      const hx = 65;
      const jnx = 55;
      const spe = 50;
      const transfi = 40;
      const counterspe = 35;
      const healingspe = -40;
      if (character2.category == 'Charm') damage1 = chrm;
      if (character2.category == 'Curse') damage1 = crse;
      if (character2.category == 'Hex') damage1 = hx;
      if (character2.category == 'Jinx') damage1 = jnx;
      if (character2.category == 'Spell') damage1 = spe;
      if (character2.category == 'Transfiguration') damage1 = transfi;
      if (character2.category == 'Counter-spell') damage1 = counterspe;
      if (character2.category == 'Healing spell') damage1 = healingspe;

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

    const spetotal = 20;
    res.json({ spells: temporary2.slice(0, spetotal) });
  } catch (card) {
    console.log(card);
    const errornum2 = 500;
    res.status(errornum2).json({ error: 'erro ao buscar feiticos' });
  }
});

// monta deck cpu com personagens aleatorios
app.post('/api/cpu-deck', async (req, res) => {
  try {
    const eight2 = 8;
    const pagee2 = Math.floor(Math.random() * eight2) + 1;
    const chars2 = await fetch(`https://api.potterdb.com/v1/characters?page[size]=100&page[number]=${pagee2}`);
    const read3 = await chars2.json();

    const temporary3 = [];
    for (let i = 0; i < read3.data.length; i++) {
      const player3 = read3.data[i];
      const character3 = player3.attributes;
      if (!character3.name || character3.name == '' || !character3.image) continue;

      const basic2 = 50;

      let power2 = basic2;
      const gryff2 = 90;
      const slythe2 = 85;
      const huffle2 = 75;
      const raven2 = 80;
      if (character3.house == 'Gryffindor') power2 = gryff2;
      if (character3.house == 'Slytherin') power2 = slythe2;
      if (character3.house == 'Hufflepuff') power2 = huffle2;
      if (character3.house == 'Ravenclaw') power2 = raven2;

      let magic2 = basic2;
      const hum2 = 70;
      const halfg2 = 88;
      const gia2 = 95;
      const hoelf2 = 82;
      const gho2 = 60;
      const werew2 = 91;
      const vamp2 = 87;
      const centa2 = 78;
      if (character3.species == 'human') magic2 = hum2;
      if (character3.species == 'half-giant') magic2 = halfg2;
      if (character3.species == 'giant') magic2 = gia2;
      if (character3.species == 'house elf') magic2 = hoelf2;
      if (character3.species == 'ghost') magic2 = werew2;
      if (character3.species == 'werewolf') magic2 = werew2;
      if (character3.species == 'vampire') magic2 = vamp2;
      if (character3.species == 'centaur') magic2 = centa2;

      let defense2 = basic2;
      const pureb2 = 90;
      const halfb2 = 75;
      const muggleb2 = 70;
      const mug2 = 40;
      const squi2 = 35;
      if (character3.ancestry == 'pure-blood') defense2 = pureb2;
      if (character3.ancestry == 'half-blood') defense2 = halfb2;
      if (character3.ancestry == 'muggle-born') defense2 = muggleb2;
      if (character3.ancestry == 'muggle') defense2 = mug2;
      if (character3.ancestry == 'squib') defense2 = squi2;

      const twenty2 = 20;
      const current2 = 80;
      const hp = defense2 + Math.floor(Math.random() * twenty2) + current2;

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

    const decktotal = 2;
    res.json({ deck: temporary3.slice(0, decktotal) });
  } catch (card) {
    console.log(card);
    const errornum3 = 500;
    res.status(errornum3).json({ error: 'erro ao montar deck cpu' });
  }
});

const portaname = 3000;
app.listen(portaname, () => {
  console.log('rodando na porta 3000');
});

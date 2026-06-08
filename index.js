const express = require('express')
const fetch = require('node-fetch')

const app = express()
app.use(express.static('public'))
app.use(express.json())

// ---------------------------------------------------------
// FUNÇÕES AUXILIARES (HELPERS)
// ---------------------------------------------------------

// Responsabilidade Única: Embaralhar qualquer array (DRY)
function shuffleArray(array) {
  const arr = [...array] // Cria uma cópia para não alterar o original
  for (let x = arr.length - 1; x > 0; x--) {
    const y = Math.floor(Math.random() * (x + 1))
    const z = arr[x]; arr[x] = arr[y]; arr[y] = z
  }
  return arr
}

// Responsabilidade Única: Calcular atributos e formatar o personagem
function formatCharacter(c) {
  const a = c.attributes
  // Se não tiver nome ou imagem, retorna null para ignorarmos depois
  if (!a.name || a.name === '' || !a.image) return null

  let pw = 50
  if (a.house === 'Gryffindor') pw = 90
  if (a.house === 'Slytherin') pw = 85
  if (a.house === 'Hufflepuff') pw = 75
  if (a.house === 'Ravenclaw') pw = 80

  let mg = 50
  if (a.species === 'human') mg = 70
  if (a.species === 'half-giant') mg = 88
  if (a.species === 'giant') mg = 95
  if (a.species === 'house elf') mg = 82
  if (a.species === 'ghost') mg = 60
  if (a.species === 'werewolf') mg = 91
  if (a.species === 'vampire') mg = 87
  if (a.species === 'centaur') mg = 78

  let df = 50
  if (a.ancestry === 'pure-blood') df = 90
  if (a.ancestry === 'half-blood') df = 75
  if (a.ancestry === 'muggle-born') df = 70
  if (a.ancestry === 'muggle') df = 40
  if (a.ancestry === 'squib') df = 35

  let hp = df + Math.floor(Math.random() * 20) + 80

  return {
    id: c.id,
    name: a.name,
    house: a.house || 'Unknown',
    species: a.species || 'Unknown',
    ancestry: a.ancestry || 'Unknown',
    image: a.image,
    power: pw,
    magic: mg,
    defense: df,
    hp: hp,
    maxHp: hp
  }
}

// Responsabilidade Única: Calcular dano e formatar feitiços
function formatSpell(s) {
  const a = s.attributes
  if (!a.name || a.name === '') return null

  let dmg = 30
  if (a.category === 'Charm') dmg = 45
  if (a.category === 'Curse') dmg = 90
  if (a.category === 'Hex') dmg = 65
  if (a.category === 'Jinx') dmg = 55
  if (a.category === 'Spell') dmg = 50
  if (a.category === 'Transfiguration') dmg = 40
  if (a.category === 'Counter-spell') dmg = 35
  if (a.category === 'Healing spell') dmg = -40

  return {
    id: s.id,
    name: a.name,
    effect: a.effect || 'Efeito desconhecido',
    category: a.category || 'Spell',
    light: a.light || 'Unknown',
    damage: dmg
  }
}

// ---------------------------------------------------------
// ROTAS DA API
// ---------------------------------------------------------

// Pega pack de cartas aleatorias
app.get('/api/pack', async (req, res) => {
  try {
    const pg = Math.floor(Math.random() * 8) + 1
    const d = await fetch('https://api.potterdb.com/v1/characters?page[size]=100&page[number]=' + pg)
    const r = await d.json()

    // 1. Mapeia todos os personagens passando pela nossa função formatCharacter
    // 2. Filtra removendo os nulos (personagens sem imagem ou nome)
    let tmp = r.data.map(formatCharacter).filter(char => char !== null)

    // 3. Embaralha a lista limpa
    tmp = shuffleArray(tmp)

    // 4. Retorna as 4 primeiras cartas
    res.json({ cards: tmp.slice(0, 4) })
  } catch(e) {
    console.log(e)
    res.status(500).json({ error: 'erro ao buscar personagens' })
  }
})

// Pega feiticos disponiveis
app.get('/api/spells', async (req, res) => {
  try {
    const d = await fetch('https://api.potterdb.com/v1/spells?page[size]=100')
    const r = await d.json()

    let tmp = r.data.map(formatSpell).filter(spell => spell !== null)
    tmp = shuffleArray(tmp)

    res.json({ spells: tmp.slice(0, 20) })
  } catch(e) {
    console.log(e)
    res.status(500).json({ error: 'erro ao buscar feiticos' })
  }
})

// Monta deck cpu com personagens aleatorios
app.post('/api/cpu-deck', async (req, res) => {
  try {
    const pg = Math.floor(Math.random() * 8) + 1
    const d = await fetch('https://api.potterdb.com/v1/characters?page[size]=100&page[number]=' + pg)
    const r = await d.json()

    // O mesmo processo enxuto feito no /api/pack! (Adeus, duplicação!)
    let tmp = r.data.map(formatCharacter).filter(char => char !== null)
    tmp = shuffleArray(tmp)

    res.json({ deck: tmp.slice(0, 2) })
  } catch(e) {
    console.log(e)
    res.status(500).json({ error: 'erro ao montar deck cpu' })
  }
})

app.listen(3000, () => {
  console.log('rodando na porta 3000')
})
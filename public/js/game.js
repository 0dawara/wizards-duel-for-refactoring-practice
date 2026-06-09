// ── CONSTANTES ─────────────────────────────────────────
const GAME_CONSTANTS = {
  MAX_DRAFT_SELECTION: 2,
  STARTING_SPELLS_COUNT: 5,
  TIMEOUT_FAST: 500,
  TIMEOUT_HIT: 600,
  TIMEOUT_CPU_TURN: 800,
  TIMEOUT_CHECK_DEATH: 700,
  DAMAGE_RANDOM_MIN: 0.8,
  DAMAGE_RANDOM_MAX: 1.2,
};

// ── ESTADO GLOBAL ──────────────────────────────────────
const state = {
  phase: 'loading',
  pack: [],
  selectedCards: [],
  playerDeck: [],
  cpuDeck: [],
  spells: [],
  playerSpells: [],
  round: 1,
  scoreP: 0,
  scoreC: 0,
  waiting: false,
};

// ── UTILS ──────────────────────────────────────────────
function shuffleArray(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
  }
  return arr;
}

function getHouseColor(houseName) {
  if (houseName === 'Gryffindor') return '#6b1010';
  if (houseName === 'Slytherin') return '#0a3018';
  if (houseName === 'Hufflepuff') return '#3a2800';
  if (houseName === 'Ravenclaw') return '#0a1a3a';
  return '#1e1040';
}
function getHouseEmoji(houseName) {
  if (houseName === 'Gryffindor') return '🦁';
  if (houseName === 'Slytherin') return '🐍';
  if (houseName === 'Hufflepuff') return '🦡';
  if (houseName === 'Ravenclaw') return '🦅';
  return '✦';
}
function hpColor(healthPercentage) {
  if (healthPercentage > 0.6) return 'linear-gradient(90deg,#0a4a2a,#22cc77)';
  if (healthPercentage > 0.3) return 'linear-gradient(90deg,#4a3a00,#ccaa22)';
  return 'linear-gradient(90deg,#4a0a0a,#cc2222)';
}
function log(message, type) {
  type = type || 'info';
  const element = document.getElementById('battleLog');
  const span = document.createElement('span');
  span.className = `log-entry ${type}`;
  span.textContent = message;
  element.appendChild(span);
  element.scrollTop = element.scrollHeight;
}
function setStatus(message) {
  document.getElementById('battleStatus').textContent = message;
}
function showScreen(id) {
  document.querySelectorAll('.screen').forEach((s) => { s.classList.remove('active'); });
  const element = document.getElementById(id);
  if (element) element.classList.add('active');
}

// ── LOADING ────────────────────────────────────────────
async function loadGame() {
  const bar = document.getElementById('loadBar');
  const message = document.getElementById('loadMsg');

  message.textContent = 'Invocando personagens...';
  bar.style.width = '20%';

  const packRes = await fetch('/api/pack');
  const packData = await packRes.json();
  state.pack = packData.cards;

  bar.style.width = '55%';
  message.textContent = 'Consultando o livro de feitiços...';

  const spellRes = await fetch('/api/spells');
  const spellData = await spellRes.json();
  state.spells = spellData.spells;

  bar.style.width = '85%';
  message.textContent = 'Preparando o adversário...';

  const cpuRes = await fetch('/api/cpu-deck', { method: 'POST' });
  const cpuData = await cpuRes.json();
  state.cpuDeck = cpuData.deck;

  // atribui 3 feitiços aleatorios ao jogador
  const shuffled = state.spells.slice();
  for (let x = shuffled.length - 1; x > 0; x--) {
    const y = Math.floor(Math.random() * (x + 1));
    const z = shuffled[x]; shuffled[x] = shuffled[y]; shuffled[y] = z;
  }
  state.playerSpells = shuffled.slice(0, GAME_CONSTANTS.STARTING_SPELLS_COUNT);

  bar.style.width = '100%';
  message.textContent = 'Pronto!';

  setTimeout(() => {
    document.getElementById('screen-loading').classList.add('fade-out');
    setTimeout(() => {
      document.getElementById('screen-loading').style.display = 'none';
      showScreen('screen-draft');
      renderPack();
    }, 600);
  }, 400);
}

// ── DRAFT ──────────────────────────────────────────────
function renderPack() {
  const grid = document.getElementById('packGrid');
  grid.innerHTML = '';
  for (let i = 0; i < state.pack.length; i++) {
    const character = state.pack[i];
    const isSelected = state.selectedCards.indexOf(i) >= 0;
    const cardElement = document.createElement('cardElement');
    cardElement.className = `card${isSelected ? ' selected' : ''}`;
    cardElement.innerHTML = renderCard(character, true);
    cardElement.setAttribute('data-idx', i);
    cardElement.onclick = (function (idx) { return function () { toggleDraftCard(idx); }; }(i));
    grid.appendChild(cardElement);
  }
  document.getElementById('draftCount').textContent = state.selectedCards.length;
  document.getElementById('btnConfirmDraft').disabled = state.selectedCards.length < GAME_CONSTANTS.MAX_DRAFT_SELECTION;
}

function toggleDraftCard(idx) {
  const pos = state.selectedCards.indexOf(idx);
  if (pos >= 0) {
    state.selectedCards.splice(pos, 1);
  } else {
    if (state.selectedCards.length >= GAME_CONSTANTS.MAX_DRAFT_SELECTION) return;
    state.selectedCards.push(idx);
  }
  renderPack();
}

async function rerollPack() {
  state.selectedCards = [];
  document.getElementById('packGrid').innerHTML = '<div style="text-align:center;padding:40px;font-family:Cinzel,serif;font-size:0.7rem;letter-spacing:2px;color:var(--parchment-dark);grid-column:1/-1">Invocando novos bruxos...</div>';
  const res = await fetch('/api/pack');
  const data = await res.json();
  state.pack = data.cards;
  renderPack();
}

function confirmDraft() {
  if (state.selectedCards.length < GAME_CONSTANTS.MAX_DRAFT_SELECTION) return;
  state.playerDeck = [state.pack[state.selectedCards[0]], state.pack[state.selectedCards[1]]];
  startBattle();
}

// ── BATTLE ─────────────────────────────────────────────
function startBattle() {
  state.round = 1;
  state.scoreP = 0;
  state.scoreC = 0;
  state.waiting = false;

  document.getElementById('scoreP').textContent = '0';
  document.getElementById('scoreC').textContent = '0';
  document.getElementById('roundNum').textContent = '1';
  document.getElementById('battleLog').innerHTML = '';
  document.getElementById('btnNext').style.display = 'none';

  showScreen('screen-battle');
  renderBattleState();
  log('⚔ O duelo começou! Escolha um feitiço para atacar.', 'info');
  setStatus('Escolha um feitiço para atacar!');
}

function getActiveIdx(deck) {
  for (let i = 0; i < deck.length; i++) {
    if (deck[i].hp > 0) return i;
  }
  return -1;
}

function renderBattleState() {
  const playerIndex = getActiveIdx(state.playerDeck);
  const cpuIndex = getActiveIdx(state.cpuDeck);

  if (playerIndex < 0 || cpuIndex < 0) { endGame(); return; }

  const playerCharacter = state.playerDeck[playerIndex];
  const cpuCharacter = state.cpuDeck[cpuIndex];

  document.getElementById('playerActiveName').textContent = playerCharacter.name;
  document.getElementById('cpuActiveName').textContent = cpuCharacter.name;

  const playerSlot = document.getElementById('playerCardSlot');
  const cpuSlot = document.getElementById('cpuCardSlot');

  const playerDiv = document.createElement('cardElement');
  playerDiv.className = 'card battle-card';
  playerDiv.id = 'battleCardP';
  playerDiv.innerHTML = renderCard(playerCharacter, false);
  playerSlot.innerHTML = '';
  playerSlot.appendChild(playerDiv);

  const cpuDiv = document.createElement('cardElement');
  cpuDiv.className = 'card battle-card';
  cpuDiv.id = 'battleCardC';
  cpuDiv.innerHTML = renderCard(cpuCharacter, false);
  cpuSlot.innerHTML = '';
  cpuSlot.appendChild(cpuDiv);

  renderDeckBadges(state.playerDeck, playerIndex, 'playerDeckBadges');
  renderDeckBadges(state.cpuDeck, cpuIndex, 'cpuDeckBadges');
  renderSpells(!state.waiting);
}

function castSpell(spellIdx) {
  if (state.waiting) return;
  state.waiting = true;
  renderSpells(false);

  const selectedSpell = state.playerSpells[spellIdx];
  const playerIndex = getActiveIdx(state.playerDeck);
  const cpuIndex = getActiveIdx(state.cpuDeck);
  const playerCharacter = state.playerDeck[playerIndex];
  const cpuCharacter = state.cpuDeck[cpuIndex];

  // aplica feitico do jogador
  const playerDamage = Math.floor(selectedSpell.damage * (playerCharacter.magic / 100) * (Math.random() * (GAME_CONSTANTS.DAMAGE_RANDOM_MAX - GAME_CONSTANTS.DAMAGE_RANDOM_MIN) + GAME_CONSTANTS.DAMAGE_RANDOM_MIN));

  if (selectedSpell.damage < 0) {
    // cura
    const heal = Math.abs(playerDamage);
    playerCharacter.hp = Math.min(playerCharacter.maxHp, playerCharacter.hp + heal);
    log(`✨ ${selectedSpell.name} — você curou ${heal} HP! (${playerCharacter.name}: ${playerCharacter.hp} HP)`, 'heal');
    document.getElementById('battleCardP').classList.add('battling');
    setTimeout(() => { document.getElementById('battleCardP') && document.getElementById('battleCardP').classList.remove('battling'); }, GAME_CONSTANTS.TIMEOUT_FAST);
  } else {
    // ataque
    cpuCharacter.hp -= playerDamage;
    log(`⚡ ${selectedSpell.name} → ${cpuCharacter.name} perdeu ${playerDamage} HP! (${cpuCharacter.name}: ${Math.max(0, cpuCharacter.hp)} HP)`, 'win');
    document.getElementById('battleCardC').classList.add('hit');
    setTimeout(() => { document.getElementById('battleCardC') && document.getElementById('battleCardC').classList.remove('hit'); }, GAME_CONSTANTS.TIMEOUT_HIT);
  }

  // cpu escolhe feitico aleatorio
  setTimeout(() => {
    const cpuSpellIdx = Math.floor(Math.random() * state.spells.length);
    const cpuSpell = state.spells[cpuSpellIdx];
    const cpuDamage = Math.floor(cpuSpell.damage * (cpuCharacter.magic / 100) * (Math.random() * (GAME_CONSTANTS.DAMAGE_RANDOM_MAX - GAME_CONSTANTS.DAMAGE_RANDOM_MIN) + GAME_CONSTANTS.DAMAGE_RANDOM_MIN));

    if (cpuSpell.damage < 0) {
      const cpuHeal = Math.abs(cpuDamage);
      cpuCharacter.hp = Math.min(cpuCharacter.maxHp, cpuCharacter.hp + cpuHeal);
      log(`🧙 CPU: ${cpuSpell.name} — CPU curou ${cpuHeal} HP! (${cpuCharacter.name}: ${cpuCharacter.hp} HP)`, 'heal');
      document.getElementById('battleCardC') && document.getElementById('battleCardC').classList.add('battling');
      setTimeout(() => { document.getElementById('battleCardC') && document.getElementById('battleCardC').classList.remove('battling'); }, GAME_CONSTANTS.TIMEOUT_FAST);
    } else {
      playerCharacter.hp -= cpuDamage;
      log(`💀 CPU: ${cpuSpell.name} → ${playerCharacter.name} perdeu ${cpuDamage} HP! (${playerCharacter.name}: ${Math.max(0, playerCharacter.hp)} HP)`, 'lose');
      document.getElementById('battleCardP') && document.getElementById('battleCardP').classList.add('hit');
      setTimeout(() => { document.getElementById('battleCardP') && document.getElementById('battleCardP').classList.remove('hit'); }, GAME_CONSTANTS.TIMEOUT_HIT);
    }

    setTimeout(() => {
      // verifica mortes
      const pNewIdx = getActiveIdx(state.playerDeck);
      const cNewIdx = getActiveIdx(state.cpuDeck);

      let roundOver = false;

      if (playerIndex >= 0 && state.playerDeck[playerIndex].hp <= 0) {
        log(`💀 ${state.playerDeck[playerIndex].name} foi derrotado!`, 'lose');
        state.scoreC++;
        document.getElementById('scoreC').textContent = state.scoreC;
        roundOver = true;
      }
      if (cpuIndex >= 0 && state.cpuDeck[cpuIndex].hp <= 0) {
        log(`🏆 ${state.cpuDeck[cpuIndex].name} foi derrotado!`, 'win');
        state.scoreP++;
        document.getElementById('scoreP').textContent = state.scoreP;
        roundOver = true;
      }

      renderBattleState();

      const pAlive = getActiveIdx(state.playerDeck);
      const cAlive = getActiveIdx(state.cpuDeck);

      if (pAlive < 0 || cAlive < 0) {
        setTimeout(endGame, GAME_CONSTANTS.TIMEOUT_CPU_TURN);
        return;
      }

      state.waiting = false;

      if (roundOver) {
        state.round++;
        document.getElementById('roundNum').textContent = state.round;
        log(`— Rodada ${state.round} —`, 'info');
      }

      setStatus('Escolha um feitiço para atacar!');
      renderSpells(true);
    }, GAME_CONSTANTS.TIMEOUT_CHECK_DEATH);
  }, GAME_CONSTANTS.TIMEOUT_CPU_TURN);
}

function nextRound() {
  document.getElementById('btnNext').style.display = 'none';
  state.round++;
  document.getElementById('roundNum').textContent = state.round;
  log(`— Rodada ${state.round} —`, 'info');
  state.waiting = false;
  renderBattleState();
  setStatus('Escolha um feitiço para atacar!');
}

// ── END ────────────────────────────────────────────────
function endGame() {
  const over = document.getElementById('screen-over');
  const glyph = document.getElementById('overGlyph');
  const title = document.getElementById('overTitle');
  const sub = document.getElementById('overSub');
  const score = document.getElementById('overScore');

  if (state.scoreP > state.scoreC) {
    glyph.textContent = '🏆';
    title.textContent = 'Vitória!';
    sub.textContent = 'Você dominou o duelo!';
  } else if (state.scoreC > state.scoreP) {
    glyph.textContent = '💀';
    title.textContent = 'Derrota';
    sub.textContent = 'O CPU foi mais poderoso desta vez.';
  } else {
    glyph.textContent = '✦';
    title.textContent = 'Empate';
    sub.textContent = 'Bruxos igualmente poderosos.';
  }
  score.textContent = `Você ${state.scoreP}  ×  ${state.scoreC} CPU`;
  over.classList.add('active');
}

function restartGame() {
  document.getElementById('screen-over').classList.remove('active');
  state.selectedCards = [];
  state.pack = [];
  state.playerDeck = [];

  // mostra loading de novo
  const loadEl = document.getElementById('screen-loading');
  loadEl.style.display = 'flex';
  loadEl.classList.remove('fade-out');
  document.getElementById('loadBar').style.width = '0%';
  showScreen('');
  loadGame();
}

// ── INIT ───────────────────────────────────────────────
loadGame();

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

  const shuffled = shuffleArray(state.spells);
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

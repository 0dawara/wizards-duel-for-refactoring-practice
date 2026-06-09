// ── RENDER CARTA ───────────────────────────────────────
function renderCard(character, isDraft) {
  const healthPercentage = character.hp / character.maxHp;
  const houseColor = getHouseColor(character.house);
  const houseEmoji = getHouseEmoji(character.house);

  let html = '<div class="card-img">';
  html += `<img src="${character.image}" alt="${character.name}" onerror="this.src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png'">`;
  html += `<div class="house-badge" style="background:${houseColor}">${houseEmoji}</div>`;
  html += '</div>';
  html += '<div class="card-body">';
  html += `<div class="card-name">${character.name}</div>`;
  html += `<div class="card-meta">${character.species} · ${character.house}</div>`;
  html += '<div class="hp-bar-wrap">';
  html += '<span class="hp-label">HP</span>';
  html += `<div class="hp-track"><div class="hp-fill" style="width:${Math.max(0, healthPercentage * 100)}%;background:${hpColor(healthPercentage)}"></div></div>`;
  html += `<span class="hp-val">${Math.max(0, character.hp)}/${character.maxHp}</span>`;
  html += '</div>';
  html += '<div class="mini-stats">';
  html += `<div class="mini-stat"><span class="mini-stat-icon">⚡</span><span class="mini-stat-val">${character.power}</span><span class="mini-stat-lbl">Poder</span></div>`;
  html += `<div class="mini-stat"><span class="mini-stat-icon">🔮</span><span class="mini-stat-val">${character.magic}</span><span class="mini-stat-lbl">Magia</span></div>`;
  html += `<div class="mini-stat"><span class="mini-stat-icon">🛡</span><span class="mini-stat-val">${character.defense}</span><span class="mini-stat-lbl">Defesa</span></div>`;
  html += '</div></div>';
  return html;
}

// ── DECK BADGES ────────────────────────────────────────
function renderDeckBadges(deck, activeIdx, elId) {
  const element = document.getElementById(elId);
  let html = '';
  for (let i = 0; i < deck.length; i++) {
    const cls = deck[i].hp <= 0 ? 'deck-thumb dead' : (i === activeIdx ? 'deck-thumb active' : 'deck-thumb');
    html += `<div class="${cls}"><img src="${deck[i].image}" onerror="this.src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png'"></div>`;
  }
  element.innerHTML = html;
}

// ── SPELL LIST ─────────────────────────────────────────
function renderSpells(enabled) {
  const element = document.getElementById('spellList');
  let html = '';
  for (let i = 0; i < state.playerSpells.length; i++) {
    const selectedSpell = state.playerSpells[i];
    const isHeal = selectedSpell.damage < 0;
    const dmgLabel = isHeal ? `💚 +${Math.abs(selectedSpell.damage)} HP` : `💀 ${selectedSpell.damage} dmg`;
    const dmgClass = isHeal ? 'spell-dmg heal' : 'spell-dmg attack';
    const dis = enabled ? '' : 'disabled';
    html += `<button class="spell-btn" ${dis} onclick="castSpell(${i})">`;
    html += `<div><span class="spell-name">${selectedSpell.name}</span><span class="spell-effect">${selectedSpell.effect}</span></div>`;
    html += `<span class="${dmgClass}">${dmgLabel}</span>`;
    html += '</button>';
  }
  element.innerHTML = html;
}

const THEMES = {
  animals: ["🐶", "🐱", "🐭", "🐹", "🦊", "🐻", "🐼", "🐸", "🐵", "🦁", "🐷", "🐔", "🐧", "🐢", "🐙", "🦄", "🐝", "🦋"],
  fruits: ["🍎", "🍌", "🍇", "🍓", "🍍", "🍒", "🍉", "🥝", "🍑", "🍋", "🥭", "🍈", "🍐", "🥥", "🍅", "🫐", "🍊", "🥑"],
  space: ["🚀", "🛸", "🪐", "🌟", "☄️", "🌙", "👽", "🌌", "🛰️", "⭐", "🌠", "🔭", "🌍", "🌞", "💫", "🧑‍🚀", "🌑", "⚡"],
  faces: ["😀", "😎", "🥳", "😴", "🤩", "🥶", "🤔", "😱", "🤠", "🥸", "😇", "🤯", "😜", "🙃", "😺", "🤖", "👻", "🎃"],
};

const DIFFICULTIES = {
  "4x4": { cols: 4, rows: 4 },
  "4x6": { cols: 4, rows: 6 },
  "6x6": { cols: 6, rows: 6 },
};

const boardEl = document.getElementById("board");
const timerEl = document.getElementById("timer");
const movesEl = document.getElementById("moves");
const bestEl = document.getElementById("best");
const themeSelect = document.getElementById("theme-select");
const difficultySelect = document.getElementById("difficulty-select");
const restartBtn = document.getElementById("restart-btn");
const winOverlay = document.getElementById("win-overlay");
const winSummary = document.getElementById("win-summary");
const playAgainBtn = document.getElementById("play-again-btn");

let state = {
  cards: [],
  flipped: [],
  matchedCount: 0,
  moves: 0,
  seconds: 0,
  timerHandle: null,
  started: false,
  locked: false,
};

function bestKey() {
  return `memory-best-${themeSelect.value}-${difficultySelect.value}`;
}

function loadBest() {
  const val = localStorage.getItem(bestKey());
  bestEl.textContent = val ? formatTime(Number(val)) : "--";
}

function saveBestIfNeeded() {
  const key = bestKey();
  const current = localStorage.getItem(key);
  if (!current || state.seconds < Number(current)) {
    localStorage.setItem(key, String(state.seconds));
  }
}

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildDeck() {
  const { cols, rows } = DIFFICULTIES[difficultySelect.value];
  const totalCards = cols * rows;
  const pairCount = totalCards / 2;
  const symbols = THEMES[themeSelect.value].slice(0, pairCount);
  const deck = shuffle([...symbols, ...symbols]).map((symbol, index) => ({
    id: index,
    symbol,
    flipped: false,
    matched: false,
  }));
  return { deck, cols, rows };
}

function startTimer() {
  stopTimer();
  state.timerHandle = setInterval(() => {
    state.seconds += 1;
    timerEl.textContent = formatTime(state.seconds);
  }, 1000);
}

function stopTimer() {
  if (state.timerHandle) {
    clearInterval(state.timerHandle);
    state.timerHandle = null;
  }
}

function renderBoard() {
  const { deck, cols } = buildDeck();
  state = {
    cards: deck,
    flipped: [],
    matchedCount: 0,
    moves: 0,
    seconds: 0,
    timerHandle: null,
    started: false,
    locked: false,
  };
  movesEl.textContent = "0";
  timerEl.textContent = "00:00";
  loadBest();
  winOverlay.classList.add("hidden");

  boardEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  boardEl.innerHTML = "";

  deck.forEach((card) => {
    const cardEl = document.createElement("div");
    cardEl.className = "card";
    cardEl.dataset.id = card.id;
    cardEl.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-back">?</div>
        <div class="card-face card-front">${card.symbol}</div>
      </div>
    `;
    cardEl.addEventListener("click", () => onCardClick(card.id, cardEl));
    boardEl.appendChild(cardEl);
  });
}

function onCardClick(id, cardEl) {
  if (state.locked) return;
  const card = state.cards.find((c) => c.id === id);
  if (!card || card.flipped || card.matched) return;

  if (!state.started) {
    state.started = true;
    startTimer();
  }

  card.flipped = true;
  cardEl.classList.add("flipped");
  state.flipped.push({ card, el: cardEl });

  if (state.flipped.length === 2) {
    state.moves += 1;
    movesEl.textContent = String(state.moves);
    checkMatch();
  }
}

function checkMatch() {
  const [first, second] = state.flipped;
  if (first.card.symbol === second.card.symbol) {
    first.card.matched = true;
    second.card.matched = true;
    first.el.classList.add("matched");
    second.el.classList.add("matched");
    state.matchedCount += 2;
    state.flipped = [];
    if (state.matchedCount === state.cards.length) {
      finishGame();
    }
  } else {
    state.locked = true;
    first.el.classList.add("mismatch");
    second.el.classList.add("mismatch");
    setTimeout(() => {
      first.card.flipped = false;
      second.card.flipped = false;
      first.el.classList.remove("flipped", "mismatch");
      second.el.classList.remove("flipped", "mismatch");
      state.flipped = [];
      state.locked = false;
    }, 700);
  }
}

function finishGame() {
  stopTimer();
  saveBestIfNeeded();
  loadBest();
  winSummary.textContent = `Tiempo: ${formatTime(state.seconds)} · Intentos: ${state.moves}`;
  winOverlay.classList.remove("hidden");
}

restartBtn.addEventListener("click", renderBoard);
playAgainBtn.addEventListener("click", renderBoard);
themeSelect.addEventListener("change", renderBoard);
difficultySelect.addEventListener("change", renderBoard);

renderBoard();

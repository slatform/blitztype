const words = [
  'the', 'be', 'to', 'of', 'and', 'in', 'that', 'have', 'it', 'for',
  'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but',
  'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an',
  'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so'
];

let wordList = [];
let currentIndex = 0;
let timeLeft = 30;
let totalChars = 0;
let correctChars = 0;
let gameActive = false;
let timer;

const stats = document.getElementById('stats');
const timerDisplay = document.getElementById('timer');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const wordsDiv = document.getElementById('words');
const input = document.getElementById('input');
const results = document.getElementById('results');
const wpmResult = document.getElementById('wpm-result');
const accuracyResult = document.getElementById('accuracy-result');
const charsDisplay = document.getElementById('chars');
const restartButton = document.getElementById('restart');

function initWords(count) {
  wordList = [];
  for (let i = 0; i < count; i++) {
    wordList.push(words[Math.floor(Math.random() * words.length)]);
  }
  renderWords();
}

function renderWords() {
  wordsDiv.innerHTML = '';
  wordList.slice(currentIndex, currentIndex + 20).forEach((word, i) => {
    const span = document.createElement('span');
    span.classList.add('word');
    if (i === 0) span.classList.add('current');
    span.textContent = word;
    wordsDiv.appendChild(span);
  });
}

function startGame() {
  if (gameActive) return;
  gameActive = true;
  currentIndex = 0;
  timeLeft = 30;
  totalChars = 0;
  correctChars = 0;
  timerDisplay.textContent = timeLeft;
  wpmDisplay.textContent = '0';
  accuracyDisplay.textContent = '100%';
  stats.style.opacity = '1';
  wordsDiv.style.opacity = '1';
  input.style.opacity = '1';
  input.value = '';
  input.focus();
  results.classList.add('hidden');
  initWords(50);
  clearInterval(timer);
  timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
  timeLeft--;
  timerDisplay.textContent = timeLeft;
  updateStats();
  if (timeLeft <= 0) endGame();
}

function updateStats() {
  const elapsed = (30 - timeLeft) / 60;
  const wpm = elapsed > 0 ? Math.round((correctChars / 5) / elapsed) : 0;
  const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
  wpmDisplay.textContent = wpm;
  accuracyDisplay.textContent = `${accuracy}%`;
}

function endGame() {
  gameActive = false;
  clearInterval(timer);
  stats.style.opacity = '0.5';
  wordsDiv.style.opacity = '0.5';
  input.style.opacity = '0.5';
  input.blur();
  const elapsed = 30 / 60;
  const wpm = Math.round((correctChars / 5) / elapsed);
  const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
  wpmResult.textContent = wpm;
  accuracyResult.textContent = `${accuracy}%`;
  charsDisplay.textContent = totalChars;
  results.classList.remove('hidden');
}

input.addEventListener('input', (e) => {
  if (!gameActive && e.target.value.trim()) startGame();
  if (!gameActive) return;

  const typed = e.target.value.trim();
  const currentWord = wordList[currentIndex];

  if (e.data === ' ') {
    totalChars += typed.length;
    if (typed === currentWord) {
      correctChars += currentWord.length;
      wordsDiv.children[0].classList.add('correct');
    } else {
      wordsDiv.children[0].classList.add('incorrect');
    }
    currentIndex++;
    input.value = '';
    if (currentIndex > wordList.length - 20) initWords(50);
    renderWords();
    updateStats();
  }
});

restartButton.addEventListener('click', startGame);
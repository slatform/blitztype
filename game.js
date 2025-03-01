const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const timerDisplay = document.getElementById('timer');
const wordDisplay = document.getElementById('word-display');
const inputBox = document.getElementById('input-box');
const progress = document.getElementById('progress');
const livesDisplay = document.getElementById('lives');
const scoreDisplay = document.getElementById('score');
const wpmDisplay = document.getElementById('wpm');
const charsDisplay = document.getElementById('chars');
const scoreFinalDisplay = document.getElementById('score-final');

const words = [
  'space', 'cosmic', 'galaxy', 'star', 'planet', 'orbit', 'moon', 'nebula',
  'asteroid', 'comet', 'meteor', 'gravity', 'rocket', 'launch', 'explore'
];

let currentWord = '';
let timeLeft = 15;
let totalCharsTyped = 0;
let gameRunning = false;
let interval;
let lives = 3;
let score = 0;
let streak = 0;
let wordSpeed = 5; // Seconds to cross screen

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

function startGame() {
  startScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  resultScreen.classList.add('hidden');

  timeLeft = 15;
  totalCharsTyped = 0;
  lives = 3;
  score = 0;
  streak = 0;
  gameRunning = true;
  inputBox.value = '';
  inputBox.focus();
  livesDisplay.textContent = lives;
  scoreDisplay.textContent = score;
  timerDisplay.textContent = timeLeft;
  progress.style.width = '100%';

  clearInterval(interval);
  interval = setInterval(updateTimer, 1000);
  spawnWord();
}

function spawnWord() {
  if (!gameRunning) return;
  currentWord = words[Math.floor(Math.random() * words.length)];
  wordDisplay.textContent = currentWord;
  wordDisplay.style.left = '100%';
  wordDisplay.style.top = `${Math.random() * 50 + 10}%`; // Random height in game area
  wordDisplay.style.transition = `left ${wordSpeed}s linear`;
  setTimeout(() => (wordDisplay.style.left = '-20%'), 10);
  setTimeout(checkMiss, wordSpeed * 1000);
}

function checkMiss() {
  if (gameRunning && wordDisplay.textContent === currentWord && inputBox.value !== currentWord) {
    lives--;
    livesDisplay.textContent = lives;
    if (lives <= 0) {
      endGame();
    } else {
      spawnWord();
    }
  }
}

function updateTimer() {
  timeLeft--;
  timerDisplay.textContent = timeLeft;
  progress.style.width = `${(timeLeft / 15) * 100}%`;

  if (timeLeft <= 0) {
    endGame();
  }
}

inputBox.addEventListener('input', (e) => {
  if (!gameRunning) return;

  const typed = e.target.value.trim();
  if (typed === currentWord) {
    totalCharsTyped += currentWord.length + 1;
    streak++;
    score += 10 * (streak > 1 ? Math.min(streak, 5) : 1);
    scoreDisplay.textContent = score;
    inputBox.value = '';
    wordDisplay.style.transition = 'opacity 0.2s';
    wordDisplay.style.opacity = 0;
    setTimeout(() => {
      wordDisplay.style.opacity = 1;
      spawnWord();
    }, 200);
  }
});

function endGame() {
  gameRunning = false;
  clearInterval(interval);
  gameScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');

  const wpm = Math.round((totalCharsTyped / 5) / 0.25);
  wpmDisplay.textContent = wpm;
  charsDisplay.textContent = totalCharsTyped;
  scoreFinalDisplay.textContent = score;
}
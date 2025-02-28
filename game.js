const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const timerDisplay = document.getElementById('timer');
const wordDisplay = document.getElementById('word-display');
const inputBox = document.getElementById('input-box');
const progress = document.getElementById('progress');
const wpmDisplay = document.getElementById('wpm');
const charsDisplay = document.getElementById('chars');

// Sample word list (expand this for variety)
const words = [
  'space', 'cosmic', 'galaxy', 'star', 'planet', 'orbit', 'moon', 'nebula', 
  'asteroid', 'comet', 'meteor', 'gravity', 'rocket', 'launch', 'explore'
];

let currentWordIndex = 0;
let timeLeft = 15;
let totalCharsTyped = 0;
let gameRunning = false;
let interval;

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

function startGame() {
  startScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  resultScreen.classList.add('hidden');

  currentWordIndex = 0;
  timeLeft = 15;
  totalCharsTyped = 0;
  gameRunning = true;
  inputBox.value = '';
  inputBox.focus();
  displayWord();
  timerDisplay.textContent = timeLeft;
  progress.style.width = '100%';

  clearInterval(interval);
  interval = setInterval(updateTimer, 1000);
}

function displayWord() {
  wordDisplay.textContent = words[currentWordIndex];
  wordDisplay.style.opacity = 0;
  setTimeout(() => {
    wordDisplay.style.opacity = 1;
    wordDisplay.style.transition = 'opacity 0.3s ease';
  }, 50);
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
  const currentWord = words[currentWordIndex];

  if (typed === currentWord) {
    totalCharsTyped += currentWord.length + 1; // +1 for space
    currentWordIndex = (currentWordIndex + 1) % words.length;
    inputBox.value = '';
    displayWord();
  }
});

function endGame() {
  gameRunning = false;
  clearInterval(interval);
  gameScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');

  // WPM = (characters / 5) / (time in minutes), time = 15s = 0.25min
  const wpm = Math.round((totalCharsTyped / 5) / 0.25);
  wpmDisplay.textContent = wpm;
  charsDisplay.textContent = totalCharsTyped;
}
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const restartButton = document.getElementById('restart-button');
const timerDisplay = document.getElementById('timer');
const wordContainer = document.getElementById('word-container');
const inputBox = document.getElementById('input-box');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const wpmFinalDisplay = document.getElementById('wpm-final');
const accuracyFinalDisplay = document.getElementById('accuracy-final');
const charsDisplay = document.getElementById('chars');

const words = [
  'space', 'cosmic', 'galaxy', 'star', 'planet', 'orbit', 'moon', 'nebula',
  'asteroid', 'comet', 'meteor', 'gravity', 'rocket', 'launch', 'explore',
  'sun', 'earth', 'mars', 'venus', 'jupiter', 'saturn', 'uranus', 'neptune'
];

let wordList = [];
let currentWordIndex = 0;
let timeLeft = 30;
let totalCharsTyped = 0;
let correctChars = 0;
let gameRunning = false;
let interval;

function generateWords(count) {
  wordList = [];
  for (let i = 0; i < count; i++) {
    wordList.push(words[Math.floor(Math.random() * words.length)]);
  }
  displayWords();
}

function displayWords() {
  wordContainer.innerHTML = '';
  wordList.forEach((word, index) => {
    const span = document.createElement('span');
    span.classList.add('word');
    if (index === currentWordIndex) span.classList.add('current');
    span.textContent = word;
    wordContainer.appendChild(span);
  });
}

function startGame() {
  startScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  resultScreen.classList.add('hidden');

  currentWordIndex = 0;
  timeLeft = 30;
  totalCharsTyped = 0;
  correctChars = 0;
  gameRunning = true;
  inputBox.value = '';
  inputBox.focus();
  timerDisplay.textContent = timeLeft;
  wpmDisplay.textContent = '0';
  accuracyDisplay.textContent = '100%';

  generateWords(50); // Initial batch of words
  clearInterval(interval);
  interval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  timeLeft--;
  timerDisplay.textContent = timeLeft;
  updateStats();
  if (timeLeft <= 0) endGame();
}

function updateStats() {
  const elapsedTime = (30 - timeLeft) / 60; // Minutes elapsed
  const wpm = elapsedTime > 0 ? Math.round((correctChars / 5) / elapsedTime) : 0;
  const accuracy = totalCharsTyped > 0 ? Math.round((correctChars / totalCharsTyped) * 100) : 100;
  wpmDisplay.textContent = wpm;
  accuracyDisplay.textContent = `${accuracy}%`;
}

function endGame() {
  gameRunning = false;
  clearInterval(interval);
  gameScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');

  const elapsedTime = 30 / 60; // Total test time in minutes
  const wpm = Math.round((correctChars / 5) / elapsedTime);
  const accuracy = Math.round((correctChars / totalCharsTyped) * 100) || 100;
  wpmFinalDisplay.textContent = wpm;
  accuracyFinalDisplay.textContent = `${accuracy}%`;
  charsDisplay.textContent = totalCharsTyped;
}

inputBox.addEventListener('input', (e) => {
  if (!gameRunning && e.target.value.trim()) startGame();
  if (!gameRunning) return;

  const typed = e.target.value.trim();
  const currentWord = wordList[currentWordIndex];

  if (e.data === ' ' && typed) {
    totalCharsTyped += typed.length;
    if (typed === currentWord) {
      correctChars += currentWord.length;
      wordContainer.children[currentWordIndex].classList.add('correct');
    } else {
      wordContainer.children[currentWordIndex].classList.add('incorrect');
    }
    currentWordIndex++;
    inputBox.value = '';
    if (currentWordIndex >= wordList.length - 10) generateWords(50); // Refresh words
    displayWords();
    updateStats();
  }
});

restartButton.addEventListener('click', startGame);
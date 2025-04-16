import Game from './game';

const canvas = document.querySelector('canvas') as HTMLCanvasElement;
const startButton = document.getElementById('startGame') as HTMLButtonElement;
const pauseButton = document.getElementById('pauseGame') as HTMLButtonElement;
const fullscreenButton = document.getElementById('fullscreenBtn') as HTMLButtonElement;
const scoreElement = document.getElementById('score') as HTMLSpanElement;
const gameContainer = document.querySelector('.game-container') as HTMLDivElement;
const context = canvas.getContext('2d') as CanvasRenderingContext2D;

// Set canvas size to match container
const gameWrapper = document.querySelector('.game-wrapper') as HTMLDivElement;
canvas.width = gameWrapper.clientWidth;
canvas.height = gameWrapper.clientHeight;

const canvasPosition = canvas.getBoundingClientRect();

declare global {
  interface Window {
    mouse: {
      x: number;
      y: number;
      clicked: boolean;
    };
  }
}

window.mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  clicked: false,
};

let game: Game;
let animationFrameId: number;
let isGameRunning = false;
let score = 0;
let isFullscreen = false;

function updateScore(newScore: number) {
  score = newScore;
  scoreElement.textContent = score.toString();
}

async function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) {
      await gameContainer.requestFullscreen();
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gameContainer.classList.add('fullscreen');
      fullscreenButton.textContent = 'Exit Full Screen';
      isFullscreen = true;
    } else {
      await document.exitFullscreen();
      canvas.width = gameWrapper.clientWidth;
      canvas.height = gameWrapper.clientHeight;
      gameContainer.classList.remove('fullscreen');
      fullscreenButton.textContent = 'Full Screen';
      isFullscreen = false;
    }
    
    if (isGameRunning) {
      game = new Game(canvas.width, canvas.height);
    }
  } catch (err) {
    console.error('Error attempting to toggle full screen:', err);
  }
}

function startGame() {
  if (!isGameRunning) {
    isGameRunning = true;
    game = new Game(canvas.width, canvas.height);
    animate(0);
    startButton.textContent = 'Restart Game';
  } else {
    // Restart game
    cancelAnimationFrame(animationFrameId);
    score = 0;
    updateScore(score);
    game = new Game(canvas.width, canvas.height);
    animate(0);
  }
}

function pauseGame() {
  if (isGameRunning) {
    isGameRunning = false;
    cancelAnimationFrame(animationFrameId);
    pauseButton.textContent = 'Resume';
  } else {
    isGameRunning = true;
    animate(0);
    pauseButton.textContent = 'Pause';
  }
}

window.addEventListener('load', () => {
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    window.mouse.x = e.clientX - rect.left;
    window.mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mousedown', () => (window.mouse.clicked = true));
  canvas.addEventListener('mouseup', () => (window.mouse.clicked = false));

  startButton.addEventListener('click', startGame);
  pauseButton.addEventListener('click', pauseGame);
  fullscreenButton.addEventListener('click', toggleFullscreen);

  // Handle fullscreen change event
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
      canvas.width = gameWrapper.clientWidth;
      canvas.height = gameWrapper.clientHeight;
      gameContainer.classList.remove('fullscreen');
      fullscreenButton.textContent = 'Full Screen';
      isFullscreen = false;
    }
    if (isGameRunning) {
      game = new Game(canvas.width, canvas.height);
    }
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    if (!isFullscreen) {
      canvas.width = gameWrapper.clientWidth;
      canvas.height = gameWrapper.clientHeight;
    } else {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    if (isGameRunning) {
      game = new Game(canvas.width, canvas.height);
    }
  });
});

function animate(deltaTime: number) {
  if (!isGameRunning) return;

  game.render(context);
  animationFrameId = requestAnimationFrame(animate);
}

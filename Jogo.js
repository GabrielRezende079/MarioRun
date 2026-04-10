const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const coin = document.querySelector('.coin');
const startMenu = document.getElementById('startMenu');
const gameOverScreen = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');
const restartBtn = document.getElementById('restartBtn');
const playBtn = document.getElementById('playBtn');
const bgMusic = document.getElementById('bgMusic');

let gameLoop = null;
let score = 0;
let isGameOver = false;
let isGameStarted = false;
let pipeHasPassed = false;
let coinActive = false;
let lastCoinThreshold = 0;

const jump = () => {
  if (!isGameStarted || isGameOver) return;
  
  mario.classList.add('jump');
  setTimeout(() =>{
    mario.classList.remove('jump');
  }, 500);
}

const spawnCoin = () => {
  // Random bottom position between 80px (just above ground) and 200px
  const randomBottom = Math.floor(Math.random() * 120) + 80;
  coin.style.bottom = `${randomBottom}px`;
  coin.style.display = 'block';
  coin.style.animation = 'coin-move 3s linear forwards, coin-float 1s infinite ease-in-out';
  coinActive = true;
  console.log('Coin spawned at bottom:', randomBottom);
}

const startGame = () => {
  if (isGameStarted) return;
  
  isGameStarted = true;
  isGameOver = false;
  score = 0;
  pipeHasPassed = false;
  coinActive = false;
  lastCoinThreshold = 0;
  updateScore();
  
  // Hide start menu
  startMenu.style.display = 'none';
  
  // Start music
  bgMusic.volume = 0.3;
  bgMusic.loop = true;
  bgMusic.play().catch(err => console.log('Music autoplay failed:', err));
  
  // Reset Mario
  mario.src = 'Imagens/mario.gif';
  mario.style.width = '150px';
  mario.style.marginLeft = '0';
  mario.style.animation = '';
  mario.style.bottom = '';
  
  // Reset pipe
  pipe.style.animation = '';
  pipe.style.left = '';
  pipe.style.animationPlayState = 'running';
  
  // Reset coin
  coin.style.display = 'none';
  coin.style.animation = 'none';
  
  // Start game loop
  if (gameLoop) {
    clearInterval(gameLoop);
  }
  
  gameLoop = setInterval(() => {
    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px','');

    // Pipe scoring - when pipe completely passes Mario
    if (pipePosition <= 0 && !pipeHasPassed) {
      pipeHasPassed = true;
      score++;
      updateScore();
      
      // Check if we should spawn a coin (every 10 points)
      if (score > 0 && score % 10 === 0 && score > lastCoinThreshold) {
        lastCoinThreshold = score;
        spawnCoin();
      }
    }

    // Reset pipe flag when animation restarts
    if (pipePosition > window.innerWidth - 50 && pipeHasPassed) {
      pipeHasPassed = false;
    }

    // Coin collision detection
    if (coinActive && coin.style.display !== 'none') {
      const coinPosition = coin.offsetLeft;
      const coinBottom = +window.getComputedStyle(coin).bottom.replace('px','');
      const marioBottom = marioPosition;
      const marioRight = mario.offsetLeft + mario.offsetWidth;
      
      // Coin width = 50px
      const coinRight = coinPosition + 50;
      const coinTop = coinBottom + 50;
      
      // Check if Mario's position overlaps with coin
      if (marioRight >= coinPosition && mario.offsetLeft <= coinRight &&
          marioBottom + mario.offsetHeight >= coinBottom && marioBottom <= coinTop) {
        // Mario collected the coin!
        coinActive = false;
        score += 5;
        updateScore();
        coin.style.display = 'none';
        coin.style.animation = 'none';
        console.log('Coin collected! +5 points. Score:', score);
      }
    }

    // Check if coin went off screen
    if (coinActive) {
      const coinRight = +window.getComputedStyle(coin).right.replace('px', '');
      if (coinRight > window.innerWidth) {
        // Coin went off screen
        coinActive = false;
        coin.style.display = 'none';
        coin.style.animation = 'none';
      }
    }

    // Collision detection with pipe
    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
      gameOver();
    }
  }, 10);
}

const restartGame = () => {
  isGameOver = false;
  score = 0;
  pipeHasPassed = false;
  coinActive = false;
  lastCoinThreshold = 0;
  updateScore();
  
  // Reset Mario
  mario.src = 'Imagens/mario.gif';
  mario.style.width = '150px';
  mario.style.marginLeft = '0';
  mario.style.animation = '';
  mario.style.bottom = '';
  
  // Reset pipe
  pipe.style.animation = '';
  pipe.style.left = '';
  pipe.style.animationPlayState = 'running';
  
  // Reset coin
  coin.style.display = 'none';
  coin.style.animation = 'none';
  
  // Hide game over screen
  gameOverScreen.style.display = 'none';
  
  // Restart music
  bgMusic.currentTime = 0;
  bgMusic.play().catch(err => console.log('Music restart failed:', err));
  
  // Start game loop
  if (gameLoop) {
    clearInterval(gameLoop);
  }
  
  gameLoop = setInterval(() => {
    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px','');

    // Pipe scoring
    if (pipePosition <= 0 && !pipeHasPassed) {
      pipeHasPassed = true;
      score++;
      updateScore();
      
      // Check if we should spawn a coin (every 10 points)
      if (score > 0 && score % 15 === 0 && score > lastCoinThreshold) {
        lastCoinThreshold = score;
        spawnCoin();
      }
    }

    if (pipePosition > window.innerWidth - 50 && pipeHasPassed) {
      pipeHasPassed = false;
    }

    // Coin collision detection
    if (coinActive && coin.style.display !== 'none') {
      const coinPosition = coin.offsetLeft;
      const coinBottom = +window.getComputedStyle(coin).bottom.replace('px','');
      const marioBottom = marioPosition;
      const marioRight = mario.offsetLeft + mario.offsetWidth;
      
      const coinRight = coinPosition + 50;
      const coinTop = coinBottom + 50;
      
      if (marioRight >= coinPosition && mario.offsetLeft <= coinRight &&
          marioBottom + mario.offsetHeight >= coinBottom && marioBottom <= coinTop) {
        coinActive = false;
        score += 5;
        updateScore();
        coin.style.display = 'none';
        coin.style.animation = 'none';
      }
    }

    // Check if coin went off screen
    if (coinActive) {
      const coinRight = +window.getComputedStyle(coin).right.replace('px', '');
      if (coinRight > window.innerWidth) {
        coinActive = false;
        coin.style.display = 'none';
        coin.style.animation = 'none';
      }
    }

    // Collision detection with pipe
    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
      gameOver();
    }
  }, 10);
}

const gameOver = () => {
  isGameOver = true;
  
  const pipePosition = pipe.offsetLeft;
  const marioPosition = +window.getComputedStyle(mario).bottom.replace('px','');
  
  pipe.style.animation = 'none';
  pipe.style.left = `${pipePosition}px`;

  mario.style.animation = 'none';
  mario.style.bottom = `${marioPosition}px`;

  mario.src = 'Imagens/game-over.png';
  mario.style.width = '75px';
  mario.style.marginLeft = '50px';

  // Show final score
  finalScoreElement.textContent = score;
  gameOverScreen.style.display = 'block';
  
  clearInterval(gameLoop);
}

const updateScore = () => {
  const scoreElement = document.getElementById('score');
  scoreElement.textContent = score;
}

function handleKeyPress(event) {
  if (!isGameStarted) {
    startGame();
    return;
  }

  if (isGameOver) return;

  jump();
}

// Event listeners
document.addEventListener('keydown', handleKeyPress);
playBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);

// Initialize game
updateScore();

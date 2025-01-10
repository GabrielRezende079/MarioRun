const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');


const jump = () => {
  mario.classList.add('jump');
  setTimeout(() =>{
    mario.classList.remove('jump');

  }, 500);
}

const loop = setInterval(() => {

  console.log('loop')

  const pipePosition = pipe.offsetLeft;
  const marioPosition = +window.getComputedStyle(mario).bottom.replace('px','');
  
  console.log(marioPosition);
  console.log(pipePosition)
  
  if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
    pipe.style.animation = 'none';
    pipe.style.left = `${pipePosition}px`;

    mario.style.animation = 'none';
    mario.style.bottom = `${marioPosition}px`;

    mario.src = 'Imagens/game-over.png'
    mario.style.width = '75px'
    mario.style.marginLeft = '50px'
    
    clearInterval(loop);

  }

}, 10);

document.addEventListener('keydown',jump);


// Inicializa o score com zero
let score = 0;

// Função para atualizar o score e exibir na tela
function updateScore() {
  const scoreElement = document.getElementById('score');
  scoreElement.textContent = score;
}

// Função para lidar com a pressão de teclas
function handleKeyPress(event) {
  // Aumenta o score sempre que uma tecla é pressionada
  score++;
  // Atualiza o score na tela
  updateScore();
}

// Adiciona um event listener para detectar pressionamento de teclas
document.addEventListener('keydown', handleKeyPress);

// Chama a função de atualização inicialmente
updateScore();

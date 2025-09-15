// JavaScript game logic for the Galactic Escape game.
// This code handles player movement, obstacle creation, collision detection,
// and the game over state.

const gameContainer = document.querySelector('.game-container');
const player = document.getElementById('player');
const gameOverScreen = document.getElementById('gameOverScreen');
let isAlive = true;

// Handle player movement based on mouse position
document.addEventListener('mousemove', (e) => {
    if (!isAlive) return;
    const containerRect = gameContainer.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;
    
    // Ensure the player stays within the game container's horizontal bounds
    let newLeft = mouseX - player.offsetWidth / 2;
    if (newLeft < 0) {
        newLeft = 0;
    } else if (newLeft + player.offsetWidth > containerRect.width) {
        newLeft = containerRect.width - player.offsetWidth;
    }
    player.style.left = newLeft + 'px';
});

// Function to create a new bullet obstacle
function createBullet() {
    if (!isAlive) return;
    const bullet = document.createElement('div');
    bullet.classList.add('bullet');
    gameContainer.appendChild(bullet);

    const randomX = Math.random() * (gameContainer.offsetWidth - bullet.offsetWidth);
    bullet.style.left = randomX + 'px';

    let bulletY = -20;
    const bulletMoveInterval = setInterval(() => {
        if (!isAlive) {
            clearInterval(bulletMoveInterval);
            return;
        }
        bulletY += 5; // Speed of the bullet
        bullet.style.top = bulletY + 'px';
        if (bulletY > gameContainer.offsetHeight) {
            clearInterval(bulletMoveInterval);
            if (gameContainer.contains(bullet)) {
                gameContainer.removeChild(bullet);
            }
        }
    }, 16);
    
    // Schedule the next bullet creation
    setTimeout(createBullet, Math.random() * 1000 + 500);
}

createBullet();

// Function to check for collisions between the player and bullets
function checkCollision() {
    if (!isAlive) return;
    const playerRect = player.getBoundingClientRect();
    const bullets = document.querySelectorAll('.bullet');

    bullets.forEach(bullet => {
        const bulletRect = bullet.getBoundingClientRect();
        if (
            playerRect.top < bulletRect.bottom &&
            playerRect.bottom > bulletRect.top &&
            playerRect.left < bulletRect.right &&
            playerRect.right > bulletRect.left
        ) {
            isAlive = false;
            gameOverScreen.style.display = 'flex';
        }
    });
    // Continue checking for collisions
    requestAnimationFrame(checkCollision);
}

checkCollision();

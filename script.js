const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

// Load assets
const playerImg = new Image();
playerImg.src = "logo.png"; // Logo karakter

// Background layers (city aesthetic)
const bgImg = new Image();
bgImg.src = "https://i.ibb.co/wQZVxxk/city-skyline.png"; // Bebas hak cipta

// Sounds
const bgMusic = document.getElementById("bgMusic");
const jumpSound = document.getElementById("jumpSound");
const coinSound = document.getElementById("coinSound");

// Game variables
let player = { x: 50, y: 300, width: 50, height: 50, dy: 0, gravity: 0.8, jumpPower: -12, grounded: false };
let coins = [];
let score = 0;
let coinCount = 0;
let speed = 4;
let bgX = 0;

// Handle jump
function jump() {
    if (player.grounded) {
        player.dy = player.jumpPower;
        player.grounded = false;
        jumpSound.play();
    }
}

document.addEventListener("keydown", e => {
    if (e.code === "Space") jump();
});

document.getElementById("jumpButton").addEventListener("click", jump);

// Spawn coins
function spawnCoin() {
    coins.push({ x: canvas.width, y: Math.random() * 200 + 150, size: 20 });
}

setInterval(spawnCoin, 2000);

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move background
    bgX -= speed / 2;
    if (bgX <= -canvas.width) bgX = 0;
    ctx.drawImage(bgImg, bgX, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImg, bgX + canvas.width, 0, canvas.width, canvas.height);

    // Player physics
    player.y += player.dy;
    player.dy += player.gravity;
    if (player.y + player.height >= canvas.height - 30) {
        player.y = canvas.height - 30 - player.height;
        player.dy = 0;
        player.grounded = true;
    }

    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

    // Draw and move coins
    for (let i = coins.length - 1; i >= 0; i--) {
        let c = coins[i];
        c.x -= speed;

        ctx.beginPath();
        ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
        ctx.fillStyle = "gold";
        ctx.fill();

        // Collision with player
        if (
            player.x < c.x + c.size &&
            player.x + player.width > c.x - c.size &&
            player.y < c.y + c.size &&
            player.y + player.height > c.y - c.size
        ) {
            coins.splice(i, 1);
            coinCount++;
            coinSound.play();
        }

        // Remove off-screen coins
        if (c.x + c.size < 0) coins.splice(i, 1);
    }

    // Update score
    score++;
    document.getElementById("score").innerText = score;
    document.getElementById("coins").innerText = coinCount;

    requestAnimationFrame(gameLoop);
}

// Start music after user interaction
window.addEventListener("click", () => {
    if (bgMusic.paused) {
        bgMusic.play();
    }
});

gameLoop();

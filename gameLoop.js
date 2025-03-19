let gameOver = false; // ✅ Fix: Ensure this variable exists globally
let score = 0; // ✅ Global variable to track score
let asteroidIncreaseTimer = 0; // ✅ Fix: Declare variable
const enemies = [];
const enemyLasers = [];


function update() {
    if (gameOver) return; // Stop updating if the game is over

    player.move(keys);

    // Move lasers
    for (let i = lasers.length - 1; i >= 0; i--) {
        lasers[i].move();
        if (lasers[i].y < 0) lasers.splice(i, 1);
    }

    // Move asteroids
    for (let i = asteroids.length - 1; i >= 0; i--) {
        asteroids[i].move();
        if (asteroids[i].y > canvas.height) asteroids.splice(i, 1);
    }

    // 🚀 **Increase Asteroid Spawn Rate Over Time**
    asteroidIncreaseTimer++;
    if (asteroidIncreaseTimer >= CONFIG.asteroidIncreaseInterval) {
        CONFIG.maxAsteroids += 2; // ✅ Every 10 seconds, allow 2 more asteroids
        CONFIG.asteroidSpawnRate = Math.max(CONFIG.asteroidSpawnRate - 5, 40); // ✅ Increase spawn speed (minimum 40)
        asteroidIncreaseTimer = 0;
    }

    // 🚀 **Check Player-Asteroid Collisions with Buffer**
    for (let i = asteroids.length - 1; i >= 0; i--) {
        if (checkCollision(player, asteroids[i], true)) { // ✅ Uses updated buffer logic
            triggerGameOver(asteroids[i]);
            return;
        }
    }

    // 🚀 **Check for Laser-Asteroid Collisions**
    for (let i = lasers.length - 1; i >= 0; i--) {
        for (let j = asteroids.length - 1; j >= 0; j--) {
            if (checkCollision(lasers[i], asteroids[j], false)) {
                explosions.push(new Explosion(asteroids[j].x, asteroids[j].y));
                asteroids[j].health -= 1;

                if (asteroids[j].health <= 0) {
                    asteroids.splice(j, 1);
                    score += 10;
                }

                lasers.splice(i, 1);
                break;
            }
        }
    }

    if (enemies.length < 2 && Math.random() < 0.02) { // ✅ 2x chance to spawn an enemy
        enemies.push(new Enemy());
    }

    // 🚀 **Move enemies and handle shooting**
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].move();
    }

    // 🚀 **Move enemy lasers**
    for (let i = enemyLasers.length - 1; i >= 0; i--) {
        enemyLasers[i].move();

        // 🚀 **Check if enemy lasers hit the player (with shield system)**
        if (checkCollision(enemyLasers[i], player, true)) { 
            player.shield -= 25; // ✅ Reduce shield by 25% when hit

            // 🚀 **If shield reaches 0, trigger game over**
            if (player.shield <= 0) {
                gameOver = true;
                explosions.push(new Explosion(player.x, player.y)); // Explosion effect
                setTimeout(() => {
                    showScoreBoard();
                }, 1000);
                return;
            }

            enemyLasers.splice(i, 1); // ✅ Remove laser after hitting the player
        }

        // ✅ Remove enemy lasers if they move off-screen
        if (enemyLasers[i].y > canvas.height) {
            enemyLasers.splice(i, 1);
        }
    }


    // 🚀 **Check for Player Laser - Enemy Collisions**
    for (let i = lasers.length - 1; i >= 0; i--) {
        for (let j = enemies.length - 1; j >= 0; j--) {
            if (checkCollision(lasers[i], enemies[j], false)) { // ✅ Keep buffer at false for accuracy
                enemies[j].health -= 1;
                explosions.push(new Explosion(enemies[j].x, enemies[j].y, enemies[j].width, enemies[j].height)); // ✅ Explosion matches new size
            
                if (enemies[j].health <= 0) {
                    enemies.splice(j, 1);
                    score += 50;
                }
            
                lasers.splice(i, 1);
                break;
            }
        }
    }

    // Handle explosions
    for (let i = explosions.length - 1; i >= 0; i--) {
        explosions[i].update();
        if (explosions[i].timer <= 0) explosions.splice(i, 1);
    }

    // 🚀 **Spawn Asteroids**
    if (Math.random() < 0.04 && asteroids.length < CONFIG.maxAsteroids) {
        spawnAsteroid();
    }
}



function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Player
    player.draw(ctx);
    
    // Draw Lasers
    lasers.forEach(laser => laser.draw(ctx));

    // Draw Asteroids
    asteroids.forEach(asteroid => asteroid.draw(ctx));

    // Draw Explosions
    explosions.forEach(explosion => explosion.draw(ctx));

    // 🚀 **Display Score**
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 20, 30); // ✅ Top-left corner

    // 🚀 **Display Shield Percentage**
    ctx.fillText("Shield: " + player.shield + "%", 20, 60); // ✅ Below the score

    // 🚀 **Draw Shield Bar**
    const shieldWidth = 150; // Width of the shield bar
    const shieldHeight = 15; // Height of the shield bar
    const shieldX = 20; // Position from left
    const shieldY = 75; // Position from top

    ctx.fillStyle = "gray"; // Background bar
    ctx.fillRect(shieldX, shieldY, shieldWidth, shieldHeight);

    ctx.fillStyle = "blue"; // Shield color
    ctx.fillRect(shieldX, shieldY, (player.shield / 100) * shieldWidth, shieldHeight); // ✅ Shrinks as shield decreases

    ctx.strokeStyle = "white"; // Border
    ctx.strokeRect(shieldX, shieldY, shieldWidth, shieldHeight);

    // 🚀 **Draw enemies**
    enemies.forEach(enemy => enemy.draw(ctx));

    // 🚀 **Draw enemy lasers**
    enemyLasers.forEach(laser => laser.draw(ctx));
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// 🚀 **NEW: Handle Game Over**
function triggerGameOver(asteroid) {
    gameOver = true;

    // 🚀 **Explosion Effect**
    explosions.push(new Explosion(player.x, player.y));
    explosions.push(new Explosion(asteroid.x, asteroid.y));

    // Delay showing the scoreboard so explosion is visible
    setTimeout(() => {
        saveScore(score);  // Save the score before restarting
        showScoreBoard(score); // ✅ Ensure this function is correctly defined in scoreboard.js
    }, 1000);
}

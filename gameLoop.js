let gameOver = false; // ✅ Fix: Ensure this variable exists globally
let score = 0; // ✅ Global variable to track score
let asteroidIncreaseTimer = 0; // ✅ Fix: Declare variable
const enemies = [];
const enemyLasers = [];
let level = 1; // ✅ Start at Level 1
let enemiesDestroyed = 0; // ✅ Track how many enemies are destroyed
let enemiesNeeded = 10; // ✅ Enemies required to complete level
let maxEnemies = 2; // ✅ Number of enemies that can appear at once
let enemySpeedIncrease = 0; // ✅ Enemy speed boost per level
let levelTransition = false; // ✅ Controls the level complete message
let powerUp = null; // ✅ Tracks if a power-up is active
let doubleFire = false; // ✅ Controls if player shoots double lasers


function update() {
    if (gameOver) return; // Stop updating if the game is over

    // 🚀 **Move Stars Downward**
    for (let star of stars) {
        star.y += star.speed; // ✅ Moves downward
        if (star.y > canvas.height) {
            star.y = 0; // ✅ Loops back to the top when off-screen
            star.x = Math.random() * canvas.width; // ✅ Randomize horizontal position
        }
    }

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

    // 🚀 **Power-Up System (Ensures Only One Exists)**
    if (!powerUp && level >= 2 && Math.random() < 0.005 && !doubleFire) { // ✅ Power-up only spawns if NOT already active
        powerUp = new PowerUp();
        //console.log("✅ Power-Up Spawned at:", powerUp.x, powerUp.y); // ✅ Debugging
    }

    // 🚀 **Spawn up to `maxEnemies` at a time**
    if (enemies.length < maxEnemies && Math.random() < 0.02) {
        let newEnemy = new Enemy();
        newEnemy.speedX += enemySpeedIncrease; // ✅ Increase speed every level
        enemies.push(newEnemy);
    }


    // 🚀 **Move enemies and handle shooting**
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].move();
    }

    // 🚀 **Check if Player Collects Power-Up**
    if (powerUp && checkCollision(player, powerUp, false)) {
        doubleFire = true; // ✅ Activate double laser fire mode
        console.log("✅ Power-up collected! Double fire activated."); // ✅ Debugging
        powerUp = null; // ✅ Remove power-up from the game permanently
    }


    // 🚀 **Move enemy lasers and check for collisions**
    for (let i = enemyLasers.length - 1; i >= 0; i--) {
        if (!enemyLasers[i]) continue; // ✅ Skip if laser is already removed

        enemyLasers[i].move();

        // 🚀 **Check if enemy laser hits the player (with shield system)**
        if (enemyLasers[i] && checkCollision(enemyLasers[i], player, true)) { 
            player.shield -= 25; // ✅ Reduce shield by 25% when hit

            // 🚀 **If shield reaches 0, trigger game over**
            if (player.shield <= 0) {
                triggerGameOver(); // ✅ Properly calls the game over function
                return;
            }

            enemyLasers.splice(i, 1); // ✅ Remove laser after hitting player
            continue; // ✅ Skip further checks for this laser
        }

        // ✅ Remove enemy lasers if they move off-screen
        if (enemyLasers[i] && enemyLasers[i].y > canvas.height) {
            enemyLasers.splice(i, 1);
        }
    }


    // 🚀 **Check for Player Laser - Enemy Collisions**
    for (let i = lasers.length - 1; i >= 0; i--) {
        for (let j = enemies.length - 1; j >= 0; j--) {
            if (checkCollision(lasers[i], enemies[j])) {
                enemies[j].health -= 1;
                explosions.push(new Explosion(enemies[j].x, enemies[j].y));

                // ✅ If enemy is destroyed, increase counter
                if (enemies[j].health <= 0) {
                    enemies.splice(j, 1);
                    score += 50;
                    enemiesDestroyed++; // ✅ Count destroyed enemies

                    // 🚀 **Check if Level is Complete**
                    if (enemiesDestroyed >= enemiesNeeded) {
                        levelUp(); // ✅ Move to next level
                    }
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

function levelUp() {
    level++; // ✅ Increase level
    enemiesDestroyed = 0; // ✅ Reset enemy count
    enemiesNeeded += 5; // ✅ Require more enemies next level
    maxEnemies++; // ✅ Increase active enemies
    enemySpeedIncrease += 0.5; // ✅ Enemies get faster
    powerUp = null; // ✅ Remove power-up at level-up
    //doubleFire = false; // ✅ Reset fire mode at new level
    levelTransition = true; // ✅ Activate "LEVEL COMPLETE" message

    // ✅ Wait 3 seconds before starting the new level
    setTimeout(() => {
        enemies.length = 0; // ✅ Clear all enemies before next level
        levelTransition = false; // ✅ Hide message & start next level
    }, 3000);
}



function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 🚀 **Draw Moving Starfield (Light Grey Stars)**
    ctx.fillStyle = "rgb(180, 180, 180)"; // ✅ Light grey color
    for (let star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    }

    // 🚀 **Draw Player**
    player.draw(ctx);

    // 🚀 **Draw Lasers**
    lasers.forEach(laser => laser.draw(ctx));

    // 🚀 **Draw Asteroids**
    asteroids.forEach(asteroid => asteroid.draw(ctx));

    // 🚀 **Draw Explosions**
    explosions.forEach(explosion => explosion.draw(ctx));

    // 🚀 **Display Score, Shield, and Level with Proper Spacing**
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";

    // ✅ Define padding to keep elements from overlapping
    const textPaddingX = 20; // Left margin
    const textPaddingY = 40; // Top margin for the first text
    const textSpacing = 30;  // Spacing between lines

    ctx.fillText("Score: " + score, textPaddingX, textPaddingY);
    ctx.fillText("Wyatt's Shield: " + player.shield + "%", textPaddingX, textPaddingY + textSpacing);
    ctx.fillText("Level: " + level, textPaddingX, textPaddingY + textSpacing * 2); // Level now positioned correctly

    // 🚀 **Show "LEVEL COMPLETE!" message when transitioning**
    if (levelTransition) {
        ctx.fillStyle = "yellow";
        ctx.font = "30px Arial";
        ctx.fillText("LEVEL " + (level - 1) + " COMPLETE!", canvas.width / 2 - 120, canvas.height / 2);
    }

    // 🚀 **Draw Shield Bar Below Shield Text**
    const shieldWidth = 150;
    const shieldHeight = 15;
    const shieldX = textPaddingX;
    const shieldY = textPaddingY + textSpacing * 2 + 10; // Moves the shield bar below the Level text

    ctx.fillStyle = "gray"; // Background bar
    ctx.fillRect(shieldX, shieldY, shieldWidth, shieldHeight);

    ctx.fillStyle = "blue"; // Shield color
    ctx.fillRect(shieldX, shieldY, (player.shield / 100) * shieldWidth, shieldHeight);

    ctx.strokeStyle = "white"; // Border
    ctx.strokeRect(shieldX, shieldY, shieldWidth, shieldHeight);


    ctx.fillStyle = "gray"; // Background bar
    ctx.fillRect(shieldX, shieldY, shieldWidth, shieldHeight);

    ctx.fillStyle = "blue"; // Shield color
    ctx.fillRect(shieldX, shieldY, (player.shield / 100) * shieldWidth, shieldHeight); // ✅ Shrinks as shield decreases

    ctx.strokeStyle = "white"; // Border
    ctx.strokeRect(shieldX, shieldY, shieldWidth, shieldHeight);

    // 🚀 **Draw Power-Up with Glow Effect**
    if (powerUp) {
        ctx.save(); // ✅ Save current canvas state

        // 🔥 **Create glow effect**
        ctx.shadowColor = "rgba(0, 255, 255, 0.8)"; // ✅ Blue glow
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // 🎨 **Draw the power-up**
        powerUp.draw(ctx);

        ctx.restore(); // ✅ Restore canvas state to prevent unwanted effects
    }

    // 🚀 **Draw Enemies**
    enemies.forEach(enemy => enemy.draw(ctx));

    // 🚀 **Draw Enemy Lasers**
    enemyLasers.forEach(laser => laser.draw(ctx));
}


function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}


// 🚀 **NEW: Handle Game Over**
function triggerGameOver(asteroid = null) {
    gameOver = true;

    // 🚀 **Stop Background Music (Ensures it stops properly)**
    if (typeof backgroundMusic !== "undefined" && !backgroundMusic.paused) {
        backgroundMusic.pause(); 
        backgroundMusic.currentTime = 0; // ✅ Resets for the next game
    } else {
        console.error("❌ Background music not found or already stopped.");
    }

    // 🚀 **Explosion Effect**
    explosions.push(new Explosion(player.x, player.y));
    if (asteroid) explosions.push(new Explosion(asteroid.x, asteroid.y)); // ✅ Only explode asteroid if exists

    // 🚀 **Delay showing the scoreboard so explosion is visible**
    setTimeout(() => {
        saveScore(score);  // ✅ Save the score before restarting
        showScoreBoard(score); // ✅ Ensure this function is correctly defined in scoreboard.js
    }, 1000);
}


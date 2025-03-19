function startGame() {
    document.getElementById('startButton').remove();
    resizeCanvas(); // Ensure canvas fills the screen
    gameLoop();
}

document.getElementById('startButton').addEventListener("click", startGame);

function showScoreBoard() {
    const scoreBoard = document.createElement('div');
    scoreBoard.style.position = 'absolute';
    scoreBoard.style.top = '50%';
    scoreBoard.style.left = '50%';
    scoreBoard.style.transform = 'translate(-50%, -50%)';
    scoreBoard.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    scoreBoard.style.padding = '20px';
    scoreBoard.style.border = '2px solid white';
    scoreBoard.style.color = 'white';
    scoreBoard.style.fontSize = '18px';
    scoreBoard.style.textAlign = 'center';
    scoreBoard.style.borderRadius = '10px';

    scoreBoard.innerHTML = '<h2>Game Over</h2>';
    scoreBoard.innerHTML += `<p>Final Score: ${score}</p>`;

    // Play Again button
    const restartButton = document.createElement('button');
    restartButton.innerText = 'Play Again';
    restartButton.style.marginTop = '15px';
    restartButton.style.padding = '10px 20px';
    restartButton.style.fontSize = '18px';
    restartButton.style.borderRadius = '5px';
    restartButton.style.cursor = 'pointer';
    restartButton.onclick = resetGame;

    scoreBoard.appendChild(restartButton);
    document.body.appendChild(scoreBoard);
}

function saveScore(finalScore) {
    let highScores = JSON.parse(localStorage.getItem('highScores')) || [];

    // Save new score
    highScores.push({ name: "Player", score: finalScore });

    // Sort scores from highest to lowest
    highScores.sort((a, b) => b.score - a.score);

    // Keep only the top 10 scores
    highScores = highScores.slice(0, 10);

    // Save to localStorage
    localStorage.setItem('highScores', JSON.stringify(highScores));
}

function resetGame() {
    location.reload(); // Reload the page to restart the game
}

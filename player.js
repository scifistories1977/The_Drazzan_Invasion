class Player {
    constructor() {
        this.width = canvas.width * 0.06;
        this.height = canvas.height * 0.06;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height * 0.85;
        this.speed = CONFIG.playerSpeed;
        this.image = new Image();
        this.image.src = "assets/spaceship.png";
    }

    move(keys) {
        if (gameOver) return; // Stop player movement on game over
    
        if (keys["ArrowLeft"] && this.x > 0) this.x -= this.speed;
        if (keys["ArrowRight"] && this.x < canvas.width - this.width) this.x += this.speed;
        if (keys["ArrowUp"] && this.y > 0) this.y -= this.speed;
        if (keys["ArrowDown"] && this.y < canvas.height - this.height) this.y += this.speed;
    }
    

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

const player = new Player();

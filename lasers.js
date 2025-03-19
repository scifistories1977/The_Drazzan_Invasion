class Laser {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 4;
        this.height = 15;
        this.speed = CONFIG.laserSpeed;
    }

    move() {
        this.y -= this.speed;
    }

    draw(ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

const lasers = [];
function shootLaser() {
    lasers.push(new Laser(player.x + player.width / 2 - 2, player.y));
}

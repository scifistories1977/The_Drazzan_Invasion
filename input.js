const keys = {}; // ✅ Declare keys globally

// 🚀 **Touch Controls for Movement**
document.addEventListener("touchstart", handleTouch);
document.addEventListener("touchmove", handleTouch);
document.addEventListener("touchend", handleTouchEnd);

function handleTouch(event) {
    event.preventDefault();
    const touchX = event.touches[0].clientX;
    const touchY = event.touches[0].clientY;

    // ✅ Move left/right based on touch position
    keys["ArrowLeft"] = touchX < window.innerWidth / 2;
    keys["ArrowRight"] = touchX >= window.innerWidth / 2;

    // ✅ Move up/down based on touch position
    keys["ArrowUp"] = touchY < window.innerHeight / 2;
    keys["ArrowDown"] = touchY >= window.innerHeight / 2;
}

function handleTouchEnd(event) {
    // ✅ Reset movement when no fingers are touching the screen
    if (event.touches.length === 0) {
        keys["ArrowLeft"] = false;
        keys["ArrowRight"] = false;
        keys["ArrowUp"] = false;
        keys["ArrowDown"] = false;
    }
}

// 🚀 **Keyboard Controls (Arrow Keys + Spacebar for Shooting)**
document.addEventListener("keydown", (event) => {
    keys[event.key] = true;

    // ✅ Shoot when pressing Spacebar
    if (event.key === " ") {
        shootLaser();
    }
});

document.addEventListener("keyup", (event) => {
    keys[event.key] = false;
});

// 🚀 **Shooting Function (Used by Both Keyboard & Mobile)**
function shootLaser() {
    lasers.push(new Laser(player.x + player.width / 2, player.y)); // ✅ Uses Laser class from lasers.js
}


// 🚀 **Shooting Button for Mobile**
document.addEventListener("DOMContentLoaded", () => {
    const shootButton = document.getElementById("shootButton");

    if (shootButton) {
        shootButton.style.display = "none"; // ✅ Hides the button on load
        //shootButton.addEventListener("touchstart", shootLaser); // ✅ Fires laser on touch
    }
});

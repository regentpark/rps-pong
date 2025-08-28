const DIRECTION = {
  IDLE: 0,
  UP: 1,
  DOWN: 2
};

class Paddle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 18;
    this.height = 100;
    this.score = 0;
    this.move = DIRECTION.IDLE;
    this.speed = 8;
  }

  draw(ctx) {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update(canvasHeight) {
    if (this.move === DIRECTION.UP && this.y > 0) {
      this.y -= this.speed;
    } else if (this.move === DIRECTION.DOWN && this.y < canvasHeight - this.height) {
      this.y += this.speed;
    }
  }
}

class Ball {
  constructor(x, y) {
    this.initialX = x;
    this.initialY = y;
    this.x = x;
    this.y = y;
    this.size = 20;
    this.speedX = 5;
    this.speedY = 4;
  }

  draw(ctx) {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }

  reset() {
    this.x = this.initialX;
    this.y = this.initialY;
    this.speedX *= -1;
  }

  update(canvas, player, ai) {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.y <= 0 || this.y + this.size >= canvas.height) {
      this.speedY *= -1;
    }

    // Player collision
    if (
      this.x <= player.x + player.width &&
      this.y + this.size >= player.y &&
      this.y <= player.y + player.height
    ) {
      this.speedX *= -1;
    }

    // AI collision
    if (
      this.x + this.size >= ai.x &&
      this.y + this.size >= ai.y &&
      this.y <= ai.y + ai.height
    ) {
      this.speedX *= -1;
    }

    // Score
    if (this.x <= 0) {
      ai.score++;
      this.reset();
    } else if (this.x + this.size >= canvas.width) {
      player.score++;
      this.reset();
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("pong-canvas");
  const ctx = canvas.getContext("2d");
  const startScreen = document.getElementById("start-screen");
  const modalSelector = "#cta-popup-1756366154475"; // Replace this with your actual modal selector
  let gameStarted = false;
  let modalOpen = false;

  canvas.width = 800;
  canvas.height = 500;

  const player = new Paddle(30, canvas.height / 2 - 50);
  const ai = new Paddle(canvas.width - 50, canvas.height / 2 - 50);
  const ball = new Ball(canvas.width / 2, canvas.height / 2);

  function drawCenterLine() {
    ctx.beginPath();
    ctx.setLineDash([5, 15]);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = "#FFF";
    ctx.stroke();
  }

  function drawScores() {
    ctx.font = "32px Courier New";
    ctx.fillStyle = "#FFF";
    ctx.fillText(player.score, canvas.width / 2 - 60, 40);
    ctx.fillText(ai.score, canvas.width / 2 + 40, 40);
  }

  function gameLoop() {
    if (!gameStarted) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawCenterLine();
    drawScores();

    player.update(canvas.height);
    ai.update(canvas.height);
    ball.update(canvas, player, ai);

    player.draw(ctx);
    ai.draw(ctx);
    ball.draw(ctx);

    if (ball.y < ai.y + ai.height / 2) {
      ai.move = DIRECTION.UP;
    } else if (ball.y > ai.y + ai.height / 2) {
      ai.move = DIRECTION.DOWN;
    } else {
      ai.move = DIRECTION.IDLE;
    }

    requestAnimationFrame(gameLoop);
  }

  function startGame() {
    if (!gameStarted && modalOpen) {
      gameStarted = true;
      startScreen.style.display = "none";
      requestAnimationFrame(gameLoop);
    }
  }

  // Monitor modal visibility
  const observer = new MutationObserver(() => {
    const modal = document.querySelector(modalSelector);
    if (modal && modal.style.display !== "none") {
      modalOpen = true;
      startScreen.style.display = "block";
    } else {
      modalOpen = false;
      gameStarted = false;
      startScreen.style.display = "none";
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
  });

  // Key press to start
  document.addEventListener("keydown", (e) => {
    startGame();

    if (!gameStarted) return;

    if (e.key === "w" || e.key === "ArrowUp") {
      player.move = DIRECTION.UP;
    } else if (e.key === "s" || e.key === "ArrowDown") {
      player.move = DIRECTION.DOWN;
    }
  });

  document.addEventListener("keyup", () => {
    if (gameStarted) player.move = DIRECTION.IDLE;
  });
});

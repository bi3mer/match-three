// src/constants.ts
var SCREEN_HEIGHT = 880;
var SCREEN_WIDTH = 640;
var BOARD_WIDTH = 6;
var BOARD_HEIGHT = 7;
var IMAGE_WIDTH = SCREEN_WIDTH / BOARD_WIDTH;
var IMAGE_HEIGHT = IMAGE_WIDTH;
var STATE_PLAYER = 0;
var STATE_CHECK_BOARD = 4;
var STATE_TIME_OUT = 5;

// src/assets.ts
class Assets {
  static matchTypes;
  static backGround;
  static size;
  static init() {
    const types = [
      "apple",
      "bread",
      "coconut",
      "green-thing",
      "milk",
      "orange",
      "star"
    ];
    this.matchTypes = [];
    this.size = types.length;
    for (let i = 0;i < this.size; ++i) {
      this.matchTypes.push(new Image);
      this.matchTypes[i].src = `assets/${types[i]}.png`;
      this.matchTypes[i].width = IMAGE_WIDTH;
      this.matchTypes[i].height = IMAGE_HEIGHT;
    }
    this.backGround = new Image;
    this.backGround.src = "assets/bg.png";
  }
}

// src/board.ts
class Board {
  b;
  isDirty;
  constructor() {
    this.isDirty = true;
    this.b = [];
    for (let y = 0;y < BOARD_HEIGHT; ++y) {
      let temp = [];
      for (let x = 0;x < BOARD_WIDTH; ++x) {
        temp.push(Math.floor(Math.random() * Assets.size));
      }
      this.b.push(temp);
    }
  }
  runSwitch(x1, y1, x2, y2) {
    if (x1 == x2 && Math.abs(y1 - y2) == 1 || y1 == y2 && Math.abs(x1 - x2) == 1) {
      let temp = this.b[y1][x1];
      this.b[y1][x1] = this.b[y2][x2];
      this.b[y2][x2] = temp;
      const connectFound = this.connect3Exists();
      if (!connectFound) {
        temp = this.b[y1][x1];
        this.b[y1][x1] = this.b[y2][x2];
        this.b[y2][x2] = temp;
      }
      return connectFound;
    }
    return false;
  }
  updateBoard() {
    this.isDirty = true;
    if (this.fill()) {
      return -1;
    }
    return this.findConnect3();
  }
  fill() {
    let fillNotComplete = false;
    for (let x = 0;x < BOARD_WIDTH; ++x) {
      for (let y = BOARD_HEIGHT - 1;y >= 0; --y) {
        if (this.b[y][x] === -1) {
          if (y === 0) {
            this.b[y][x] = Math.floor(Math.random() * Assets.size);
            fillNotComplete = true;
          } else if (this.b[y - 1][x] !== -1) {
            this.b[y][x] = this.b[y - 1][x];
            this.b[y - 1][x] = -1;
            fillNotComplete = true;
          }
        }
      }
    }
    return fillNotComplete;
  }
  findConnect3() {
    let x, mod, cur;
    let score = 0;
    let totalScore = 0;
    for (let y = 0;y < BOARD_HEIGHT; ++y) {
      for (x = 0;x < BOARD_WIDTH; ++x) {
        cur = this.b[y][x];
        if (cur === -1)
          continue;
        for (score = 0;score + x < BOARD_WIDTH; ++score) {
          if (cur !== this.b[y][score + x])
            break;
        }
        if (score >= 3) {
          const max = x + score;
          for (;x < max; ++x) {
            this.b[y][x] = -1;
          }
          return score;
        }
        for (score = 0;score + y < BOARD_HEIGHT; ++score) {
          if (cur !== this.b[y + score][x])
            break;
        }
        if (score >= 3) {
          const max = y + score;
          for (;y < max; ++y) {
            this.b[y][x] = -1;
          }
          return score;
        }
      }
    }
    return 0;
  }
  connect3Exists() {
    let x, mod, cur;
    let score = 0;
    for (let y = 0;y < BOARD_HEIGHT; ++y) {
      for (x = 0;x < BOARD_WIDTH; ++x) {
        cur = this.b[y][x];
        if (cur === -1)
          continue;
        for (score = 0;score + x < BOARD_WIDTH; ++score) {
          if (cur !== this.b[y][score + x])
            break;
        }
        if (score >= 3) {
          const max = x + score;
          for (;x < max; ++x) {
            this.b[y][x] = -1;
          }
          return true;
        }
        for (score = 0;score + y < BOARD_HEIGHT; ++score) {
          if (cur !== this.b[y + score][x])
            break;
        }
        if (score >= 3) {
          return true;
        }
      }
    }
    return false;
  }
}

// src/mouse.ts
class Mouse {
  mouseDown;
  x;
  y;
  downX;
  downY;
  upX;
  upY;
  shouldHandleMouseEvent;
  constructor(canvas) {
    const offsetLeft = canvas.offsetLeft;
    const offsetTop = canvas.offsetTop;
    this.x = 0;
    this.y = 0;
    this.downX = 0;
    this.downY = 0;
    this.upX = 0;
    this.upY = 0;
    this.shouldHandleMouseEvent = false;
    canvas.addEventListener("mousemove", (e) => {
      this.x = e.x - offsetLeft;
      this.y = e.y - offsetTop;
    });
    canvas.addEventListener("mousedown", (e) => {
      this.downX = Math.floor((e.x - offsetLeft) / IMAGE_WIDTH);
      this.downY = Math.floor((e.y - offsetTop) / IMAGE_HEIGHT) - 1;
      this.mouseDown = true;
    });
    canvas.addEventListener("mouseup", (e) => {
      this.upX = Math.floor((e.x - offsetLeft) / IMAGE_WIDTH);
      this.upY = Math.floor((e.y - offsetTop) / IMAGE_HEIGHT) - 1;
      this.shouldHandleMouseEvent = true;
      this.mouseDown = false;
    });
  }
}

// src/game.ts
class Game {
  canvas;
  ctx;
  brd;
  state;
  score;
  timeOut;
  mouse;
  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("id", "canvas");
    this.canvas.setAttribute("width", `${SCREEN_WIDTH}`);
    this.canvas.setAttribute("height", `${SCREEN_HEIGHT}`);
    document.getElementById("canvashere").appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");
    this.brd = new Board;
    this.state = STATE_CHECK_BOARD;
    this.score = 0;
    this.timeOut = 0;
    this.mouse = new Mouse(this.canvas);
  }
  render() {
    this.ctx.drawImage(Assets.backGround, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    this.brd.isDirty = false;
    let y, x;
    for (y = 0;y < BOARD_HEIGHT; ++y) {
      for (x = 0;x < BOARD_WIDTH; ++x) {
        const assetIndex = this.brd.b[y][x];
        if (assetIndex == -1)
          continue;
        if (this.mouse.mouseDown && this.mouse.downX == x && this.mouse.downY == y)
          continue;
        this.ctx.drawImage(Assets.matchTypes[assetIndex], x * IMAGE_WIDTH, (y + 1) * IMAGE_HEIGHT, IMAGE_WIDTH, IMAGE_HEIGHT);
      }
    }
    if (this.mouse.mouseDown) {
      this.ctx.drawImage(Assets.matchTypes[this.brd.b[this.mouse.downY][this.mouse.downX]], this.mouse.x - IMAGE_WIDTH / 2, this.mouse.y - IMAGE_HEIGHT / 2, IMAGE_WIDTH, IMAGE_HEIGHT);
    }
    const scoreText = `Score: ${this.score}`;
    this.ctx.fillStyle = "white";
    this.ctx.font = "40px monospace";
    this.ctx.fillText(scoreText, SCREEN_WIDTH / 2.7, IMAGE_HEIGHT / 2);
  }
  update(deltaTime) {
    switch (this.state) {
      case STATE_CHECK_BOARD:
        this.checkBoardState();
        break;
      case STATE_TIME_OUT:
        this.timeOutState(deltaTime);
        break;
      case STATE_PLAYER:
        this.playerState();
        break;
      default:
        console.error(`Unhandled state '${this.state}'. The game is ruined.`);
        break;
    }
  }
  checkBoardState() {
    const modScore = this.brd.updateBoard();
    if (modScore === 0) {
      this.state = STATE_PLAYER;
    } else {
      this.score += Math.max(0, modScore);
      this.timeOut = 25;
      this.state = STATE_TIME_OUT;
    }
  }
  timeOutState(deltaTime) {
    if (this.timeOut <= 0) {
      this.state = STATE_CHECK_BOARD;
    } else {
      this.timeOut -= deltaTime;
    }
  }
  playerState() {
    if (this.mouse.shouldHandleMouseEvent) {
      this.mouse.shouldHandleMouseEvent = false;
      if (this.brd.runSwitch(this.mouse.downX, this.mouse.downY, this.mouse.upX, this.mouse.upY)) {
        this.timeOut = 500;
        this.state = STATE_TIME_OUT;
      }
    }
  }
}

// src/index.ts
(() => {
  Assets.init();
  const game2 = new Game;
  let oldTimeFrame = new Date().getTime();
  let delta = 0;
  const loop = (timeStep) => {
    delta = timeStep - oldTimeFrame;
    oldTimeFrame = timeStep;
    game2.update(delta);
    game2.render();
    window.requestAnimationFrame(loop);
  };
  window.requestAnimationFrame(loop);
})();

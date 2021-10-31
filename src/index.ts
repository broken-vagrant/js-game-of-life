import { default as Universe } from './lib/Universe';

const GRID_COLOR = '#CCCCCC';
const DEAD_COLOR = '#FFFFFF';
const ALIVE_COLOR = '#000000';

let universe: Universe, width: number, height: number;

const getIndex = (row: number, column: number) => {
  return row * width + column;
};
const getCellSize = () => {
  return typeof window !== "undefined" && window.innerWidth >= 500 ? 24 : 40;
}

const initUniverse = () => {
  const cellSize = getCellSize();

  const rows = Math.floor(Math.min(window.innerHeight - 250, 1200) / cellSize);
  const cols = Math.floor(Math.min(window.innerWidth, 1200) / cellSize);

  universe = new Universe(cols, rows);

  width = universe.getWidth();
  height = universe.getHeight();

  // Give the canvas room for all of our cells and a 1px border
  // around each of them.
  canvas.height = (cellSize + 1) * height + 1;
  canvas.width = (cellSize + 1) * width + 1;

}

const canvas = document.getElementById('game-of-life-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

const playPauseButton = document.getElementById('play-pause');
const fpsSelect = document.getElementById('fps');
const autoCheckbox = document.getElementById('auto');
const resetButton = document.getElementById('reset');
const randomButton = document.getElementById('random');
const genCount = document.getElementById('gen-count');


const drawGrid = () => {
  const cellSize = getCellSize();

  ctx.beginPath();
  ctx.strokeStyle = GRID_COLOR;

  //vertical lines
  for (let i = 0; i <= width; i++) {
    ctx.moveTo(i * (cellSize + 1) + 1, 0);
    ctx.lineTo(i * (cellSize + 1) + 1, (cellSize + 1) * height + 1);
  }

  //horizontal lines
  for (let j = 0; j <= height; j++) {
    ctx.moveTo(0, j * (cellSize + 1) + 1);
    ctx.lineTo((cellSize + 1) * width + 1, j * (cellSize + 1) + 1);
  }

  ctx.stroke();
};


let then: number, animationId: number, now: number, elapsed: number, fpsInterval: number, fps = 10, auto = true, generations = 0;

const incGenerationCount = () => {
  generations = generations + 1;
  genCount.textContent = String(generations);
}
const resetGenerationCount = () => {
  generations = 0;
  genCount.textContent = String(generations);
}

const drawCells = () => {
  const cellSize = getCellSize();

  ctx.beginPath();

  let cells = universe.getCells();
  // Alive cells.
  ctx.fillStyle = ALIVE_COLOR;
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col);
      if (cells[idx] !== true) {
        continue;
      }

      ctx.fillRect(col * (cellSize + 1) + 1, row * (cellSize + 1) + 1, cellSize, cellSize);
    }
  }

  // Dead cells.
  ctx.fillStyle = DEAD_COLOR;
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col);
      if (cells[idx] !== false) {
        continue;
      }

      ctx.fillRect(col * (cellSize + 1) + 1, row * (cellSize + 1) + 1, cellSize, cellSize);
    }
  }

  ctx.stroke();
};

const drawUniverse = () => {
  drawGrid();
  drawCells();
}

const tick = () => {
  universe.tick();

  incGenerationCount();

  drawUniverse();
}

const renderLoop = () => {

  animationId = requestAnimationFrame(renderLoop);

  // calc elapsed time since last loop
  now = Date.now();
  elapsed = now - then;

  // if enough time has elapsed, draw the next frame
  if (elapsed > fpsInterval) {
    // Get ready for next frame by setting then=now, but also adjust for your
    // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
    then = now - (elapsed % fpsInterval);

    tick()
  }
};

//Adding button interactivity
const isPaused = () => {
  return !animationId;
};

const play = () => {

  if (universe.isEmpty()) {
    alert('There is no life in current universe! click on 🔀 to generate random life!!');
    return;
  }

  playPauseButton.textContent = '⏸';

  fpsInterval = 1000 / fps;
  then = Date.now();
  renderLoop();
};
const pause = () => {

  playPauseButton.textContent = '▶';

  cancelAnimationFrame(animationId);
  animationId = null;
};

playPauseButton.addEventListener('click', (e) => {

  if (universe.isEmpty()) {
    pause();
    alert('There is no life in current universe! click on 🔀 to generate random life!!');
    return;
  }

  if (!auto) {
    tick();
    return;
  }
  if (isPaused()) {
    play();
  } else {
    pause();
  }
});
fpsSelect.addEventListener('change', (e) => {
  fps = Number((e.target as HTMLSelectElement).value);

  if (!isPaused()) {
    pause();
    play();
  }
})
autoCheckbox.addEventListener('change', (e) => {
  auto = (e.target as HTMLInputElement).checked;
  if (!auto) {
    pause();

    playPauseButton.textContent = '⏭';
  }
  else {
    playPauseButton.textContent = '▶';
  }
})
resetButton.addEventListener('click', () => {
  if (!isPaused()) {
    pause();
  }

  if (universe.isEmpty()) {
    alert('There is no life in current universe! click on 🔀 to generate random life!!');
    return;
  }

  universe.reset();
  resetGenerationCount();

  drawUniverse();
})

randomButton.addEventListener('click', () => {
  if (!isPaused()) {
    pause();
  }
  universe.setRandom();

  drawUniverse();
})

function debounce(func: (...args: any) => void, timeout = 300) {
  let timer: NodeJS.Timeout;
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}
const handleResize = () => {

  if (!isPaused()) {
    pause();
  }

  initUniverse();

  drawUniverse();
}

window.addEventListener('resize', debounce(handleResize, 200))

canvas.addEventListener('click', (e) => {
  const boundingRect = canvas.getBoundingClientRect();
  const cellSize = getCellSize();

  const scaleX = canvas.width / boundingRect.width;
  const scaleY = canvas.height / boundingRect.height;

  const canvasLeft = (e.clientX - boundingRect.left) * scaleX;
  const canvasTop = (e.clientY - boundingRect.top) * scaleY;

  const row = Math.min(Math.floor(canvasTop / (cellSize + 1)), height - 1);
  const col = Math.min(Math.floor(canvasLeft / (cellSize + 1)), width - 1);

  universe.toggleCell(row, col);

  drawGrid();
  drawCells();
})

initUniverse();

drawUniverse();

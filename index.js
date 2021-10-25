/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./fps.js":
/*!****************!*\
  !*** ./fps.js ***!
  \****************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"fps\": () => (/* binding */ fps)\n/* harmony export */ });\nconst fps = new class fps {\n  constructor() {\n    this.fps = document.getElementById('fpsInfo');\n    this.frames = [];\n    this.lastFrameTimeStamp = performance.now();\n  }\n\n  render() {\n    //Convert the delta time since the last frame render\n    //into a measure of frames per second.\n    const now = performance.now();\n    const delta = now - this.lastFrameTimeStamp;\n    this.lastFrameTimeStamp = now;\n    const fps = 1 / delta * 1000;\n\n    //Save only the latest 100 timings.\n    this.frames.push(fps);\n    if (this.frames.length > 100) {\n      this.frames.shift();\n    }\n\n    //Find the max,min, and mean of our 100 latest timings.\n    let min = Infinity;\n    let max = -Infinity;\n    let sum = 0;\n    for (let i = 0; i < this.frames.length; i++) {\n      sum += this.frames[i];\n      min = Math.min(this.frames[i], min);\n      max = Math.max(this.frames[i], max);\n    }\n    let mean = sum / this.frames.length;\n\n    //Render the statistics.\n    this.fps.textContent = `Frames per Second: avg of last 100: ${Math.round(mean)}`.trim();\n  }\n}();\n\n//# sourceURL=webpack://js-game-of-life/./fps.js?");

/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _lib_Universe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/Universe */ \"./lib/Universe.js\");\n/* harmony import */ var _lib_Universe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_lib_Universe__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _fps__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./fps */ \"./fps.js\");\n\n\n\nconst GRID_COLOR = '#CCCCCC';\nconst DEAD_COLOR = '#FFFFFF';\nconst ALIVE_COLOR = '#000000';\n\nlet universe, width, height;\n\nconst getIndex = (row, column) => {\n  return row * width + column;\n};\nconst getCellSize = () => {\n  return typeof window !== \"undefined\" && window.innerWidth >= 500 ? 24 : 40;\n}\n\nconst initUniverse = () => {\n  const cellSize = getCellSize();\n\n  const rows = Math.floor(Math.min(window.innerHeight - 250, 1200) / cellSize);\n  const cols = Math.floor(Math.min(window.innerWidth, 1200) / cellSize);\n\n  universe = new (_lib_Universe__WEBPACK_IMPORTED_MODULE_0___default())(cols, rows);\n\n  width = universe.width;\n  height = universe.height;\n\n  // Give the canvas room for all of our cells and a 1px border\n  // around each of them.\n  canvas.height = (cellSize + 1) * height + 1;\n  canvas.width = (cellSize + 1) * width + 1;\n\n}\n\nconst canvas = document.getElementById('game-of-life-canvas');\nconst ctx = canvas.getContext('2d');\n\nconst playPauseButton = document.getElementById('play-pause');\nconst fpsSelect = document.getElementById('fps');\nconst autoCheckbox = document.getElementById('auto');\nconst resetButton = document.getElementById('reset');\nconst randomButton = document.getElementById('random');\nconst genCount = document.getElementById('gen-count');\n\n\nconst drawGrid = () => {\n  const cellSize = getCellSize();\n\n  ctx.beginPath();\n  ctx.strokeStyle = GRID_COLOR;\n\n  //vertical lines\n  for (let i = 0; i <= width; i++) {\n    ctx.moveTo(i * (cellSize + 1) + 1, 0);\n    ctx.lineTo(i * (cellSize + 1) + 1, (cellSize + 1) * height + 1);\n  }\n\n  //horizontal lines\n  for (let j = 0; j <= height; j++) {\n    ctx.moveTo(0, j * (cellSize + 1) + 1);\n    ctx.lineTo((cellSize + 1) * width + 1, j * (cellSize + 1) + 1);\n  }\n\n  ctx.stroke();\n};\n\n\nlet then, animationId, now, elapsed, fpsInterval, fps = 10, auto = true, generations = 0;\n\nconst incGenerationCount = () => {\n  generations = generations + 1;\n  genCount.textContent = generations;\n}\nconst resetGenerationCount = () => {\n  generations = 0;\n  genCount.textContent = generations;\n}\n\nconst drawCells = () => {\n  const cellSize = getCellSize();\n\n  ctx.beginPath();\n\n  // Alive cells.\n  ctx.fillStyle = ALIVE_COLOR;\n  for (let row = 0; row < height; row++) {\n    for (let col = 0; col < width; col++) {\n      const idx = getIndex(row, col);\n      if (universe.cells[idx] !== true) {\n        continue;\n      }\n\n      ctx.fillRect(col * (cellSize + 1) + 1, row * (cellSize + 1) + 1, cellSize, cellSize);\n    }\n  }\n\n  // Dead cells.\n  ctx.fillStyle = DEAD_COLOR;\n  for (let row = 0; row < height; row++) {\n    for (let col = 0; col < width; col++) {\n      const idx = getIndex(row, col);\n      if (universe.cells[idx] !== false) {\n        continue;\n      }\n\n      ctx.fillRect(col * (cellSize + 1) + 1, row * (cellSize + 1) + 1, cellSize, cellSize);\n    }\n  }\n\n  ctx.stroke();\n};\n\nconst drawUniverse = () => {\n  drawGrid();\n  drawCells();\n}\n\nconst tick = () => {\n  universe.tick();\n\n  incGenerationCount();\n\n  drawUniverse();\n}\n\nconst renderLoop = () => {\n\n  animationId = requestAnimationFrame(renderLoop);\n\n  // calc elapsed time since last loop\n  now = Date.now();\n  elapsed = now - then;\n\n  // if enough time has elapsed, draw the next frame\n  if (elapsed > fpsInterval) {\n    // Get ready for next frame by setting then=now, but also adjust for your\n    // specified fpsInterval not being a multiple of RAF's interval (16.7ms)\n    then = now - (elapsed % fpsInterval);\n\n    tick()\n  }\n};\n\n//Adding button interactivity\nconst isPaused = () => {\n  return !animationId;\n};\n\nconst play = () => {\n\n  if (universe.isEmpty()) {\n    alert('There is no life in current universe! click on 🔀 to generate random life!!');\n    return;\n  }\n\n  playPauseButton.textContent = '⏸';\n\n  fpsInterval = 1000 / fps;\n  then = Date.now();\n  renderLoop();\n};\nconst pause = () => {\n\n  playPauseButton.textContent = '▶';\n\n  cancelAnimationFrame(animationId);\n  animationId = null;\n};\n\nplayPauseButton.addEventListener('click', (e) => {\n\n  if (universe.isEmpty()) {\n    pause();\n    alert('There is no life in current universe! click on 🔀 to generate random life!!');\n    return;\n  }\n\n  if (!auto) {\n    tick();\n    return;\n  }\n  if (isPaused()) {\n    play();\n  } else {\n    pause();\n  }\n});\nfpsSelect.addEventListener('change', (e) => {\n  fps = Number(e.target.value);\n\n  if (!isPaused()) {\n    pause();\n    play();\n  }\n})\nautoCheckbox.addEventListener('change', (e) => {\n  auto = e.target.checked;\n  if (!auto) {\n    pause();\n\n    playPauseButton.textContent = '⏭';\n  }\n  else {\n    playPauseButton.textContent = '▶';\n  }\n})\nresetButton.addEventListener('click', () => {\n  if (!isPaused()) {\n    pause();\n  }\n\n  if (universe.isEmpty()) {\n    alert('There is no life in current universe! click on 🔀 to generate random life!!');\n    return;\n  }\n\n  universe.reset();\n  resetGenerationCount();\n\n  drawUniverse();\n})\n\nrandomButton.addEventListener('click', () => {\n  if (!isPaused()) {\n    pause();\n  }\n  universe.setRandom();\n\n  drawUniverse();\n})\n\nfunction debounce(func, timeout = 300) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => { func.apply(this, args); }, timeout);\n  };\n}\nconst handleResize = () => {\n\n  if (!isPaused()) {\n    pause();\n  }\n\n  initUniverse();\n\n  drawUniverse();\n}\n\nwindow.addEventListener('resize', debounce(handleResize, 200))\n\ncanvas.addEventListener('click', (e) => {\n  const boundingRect = canvas.getBoundingClientRect();\n  const cellSize = getCellSize();\n\n  const scaleX = canvas.width / boundingRect.width;\n  const scaleY = canvas.height / boundingRect.height;\n\n  const canvasLeft = (e.clientX - boundingRect.left) * scaleX;\n  const canvasTop = (e.clientY - boundingRect.top) * scaleY;\n\n  const row = Math.min(Math.floor(canvasTop / (cellSize + 1)), height - 1);\n  const col = Math.min(Math.floor(canvasLeft / (cellSize + 1)), width - 1);\n\n  universe.toggleCell(row, col);\n\n  drawGrid();\n  drawCells();\n})\n\ninitUniverse();\n\ndrawUniverse();\n\n\n//# sourceURL=webpack://js-game-of-life/./index.js?");

/***/ }),

/***/ "./lib/Universe.js":
/*!*************************!*\
  !*** ./lib/Universe.js ***!
  \*************************/
/***/ ((module) => {

eval("class Universe {\n  constructor(width = 32, height = 32, random = true) {\n    this.width = width;\n    this.height = height;\n\n    this.size = width * height;\n    this.cells = [];\n\n    if (random) {\n      for (let i = 0; i < this.size; i++) {\n        this.cells.push(Math.random() > 0.7 ? true : false)\n      }\n    } else {\n      for (let i = 0; i < this.size; i++) {\n        this.cells.push(false)\n      }\n    }\n  }\n  height() {\n    return this.height;\n  }\n  width() {\n    return this.width;\n  }\n  setSize(width = null, height = null, random = true) {\n    this.width = width ? width : this.width;\n    this.height = height ? height : this.height;\n\n    if (random) {\n      this.setRandom();\n    }\n    else {\n      this.reset();\n    }\n  }\n  size() {\n    return this.size;\n  }\n  reset() {\n    this.cells = Array(this.size).fill(false);\n  }\n  setRandom() {\n    this.cells = Array(this.size).fill(null).map(() => Math.random() > 0.7 ? true : false)\n  }\n  toggleCell(row, column) {\n    let index = this.getIndex(row, column);\n    let value = this.cells[index];\n    this.cells[index] = !value;\n  }\n  isEmpty() {\n    return this.cells.every((cell) => cell == false);\n  }\n  getIndex(row, column) {\n    return row * this.width + column;\n  }\n  liveNeighbourCount(row, column) {\n    let count = 0;\n\n    let north = row == 0 ? this.height - 1 : row - 1;\n\n    let south = row == this.height - 1 ? 0 : row + 1;\n\n    let west = column == 0 ? this.width - 1 : column - 1;\n\n    let east = column == this.width - 1 ? 0 : column + 1;\n\n    let nw = this.getIndex(north, west);\n    count += this.cells[nw];\n\n    let n = this.getIndex(north, column);\n    count += this.cells[n];\n\n    let ne = this.getIndex(north, east);\n    count += this.cells[ne];\n\n    let w = this.getIndex(row, west);\n    count += this.cells[w];\n\n    let e = this.getIndex(row, east);\n    count += this.cells[e];\n\n    let sw = this.getIndex(south, west);\n    count += this.cells[sw];\n\n    let s = this.getIndex(south, column);\n    count += this.cells[s];\n\n    let se = this.getIndex(south, east);\n    count += this.cells[se];\n\n    return count;\n  }\n  tick() {\n    let next = [...this.cells];\n    for (let row = 0; row < this.height; row++) {\n      for (let column = 0; column < this.width; column++) {\n        let idx = this.getIndex(row, column);\n        let cell = this.cells[idx];\n        let live_neighbours = this.liveNeighbourCount(row, column);\n\n        //Rule 1: any live cell with fewer than two live neighbours dies, as if caused by underpopulation\n        if (cell == true && live_neighbours < 2) {\n          next[idx] = false;\n        }\n        //Rule 2 : Any live cell with two or three live neighbours lives on to the next generation\n        else if (cell == true && live_neighbours <= 3) {\n          next[idx] = true;\n        }\n        //Rule 3: Any live cell with more than three live neighbours dies,as if by overpopulation\n        else if (cell == true && live_neighbours > 3) {\n          next[idx] = false;\n        }\n        //Rule 4: Any dead cell with exactly three live neighbours becomes a live cell,as if by reproduction\n        else if (cell == false && live_neighbours == 3) {\n          next[idx] = true;\n        }\n      }\n    }\n    this.cells = next;\n  }\n  setCells(arr) {\n    for (let i = 0; i < arr.length; i++) {\n      let idx = this.getIndex(arr[i][0], arr[i][1])\n      this.cells[idx] = true;\n    }\n  }\n  print() {\n    let rows = [];\n    for (let row = 0; row < this.height; row++) {\n      let rowString = ''\n      for (let column = 0; column < this.width; column++) {\n        let idx = this.getIndex(row, column);\n        if (this.cells[idx]) {\n          rowString += ' x '\n        } else {\n          rowString += ' o '\n        }\n      }\n      rows.push(rowString);\n    }\n    console.log(rows.join('\\n') + \"\\n\");\n  }\n}\n\nmodule.exports = Universe;\n\n//# sourceURL=webpack://js-game-of-life/./lib/Universe.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./index.js");
/******/ 	
/******/ })()
;
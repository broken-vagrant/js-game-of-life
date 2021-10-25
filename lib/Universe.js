class Universe {
  constructor(width = 32, height = 32, random = true) {
    this.width = width;
    this.height = height;

    this.size = width * height;
    this.cells = [];

    if (random) {
      for (let i = 0; i < this.size; i++) {
        this.cells.push(Math.random() > 0.7 ? true : false)
      }
    } else {
      for (let i = 0; i < this.size; i++) {
        this.cells.push(false)
      }
    }
  }
  height() {
    return this.height;
  }
  width() {
    return this.width;
  }
  setSize(width = null, height = null, random = true) {
    this.width = width ? width : this.width;
    this.height = height ? height : this.height;

    if (random) {
      this.setRandom();
    }
    else {
      this.reset();
    }
  }
  size() {
    return this.size;
  }
  reset() {
    this.cells = Array(this.size).fill(false);
  }
  setRandom() {
    this.cells = Array(this.size).fill(null).map(() => Math.random() > 0.7 ? true : false)
  }
  toggleCell(row, column) {
    let index = this.getIndex(row, column);
    let value = this.cells[index];
    this.cells[index] = !value;
  }
  isEmpty() {
    return this.cells.every((cell) => cell == false);
  }
  getIndex(row, column) {
    return row * this.width + column;
  }
  liveNeighbourCount(row, column) {
    let count = 0;

    let north = row == 0 ? this.height - 1 : row - 1;

    let south = row == this.height - 1 ? 0 : row + 1;

    let west = column == 0 ? this.width - 1 : column - 1;

    let east = column == this.width - 1 ? 0 : column + 1;

    let nw = this.getIndex(north, west);
    count += this.cells[nw];

    let n = this.getIndex(north, column);
    count += this.cells[n];

    let ne = this.getIndex(north, east);
    count += this.cells[ne];

    let w = this.getIndex(row, west);
    count += this.cells[w];

    let e = this.getIndex(row, east);
    count += this.cells[e];

    let sw = this.getIndex(south, west);
    count += this.cells[sw];

    let s = this.getIndex(south, column);
    count += this.cells[s];

    let se = this.getIndex(south, east);
    count += this.cells[se];

    return count;
  }
  tick() {
    let next = [...this.cells];
    for (let row = 0; row < this.height; row++) {
      for (let column = 0; column < this.width; column++) {
        let idx = this.getIndex(row, column);
        let cell = this.cells[idx];
        let live_neighbours = this.liveNeighbourCount(row, column);

        //Rule 1: any live cell with fewer than two live neighbours dies, as if caused by underpopulation
        if (cell == true && live_neighbours < 2) {
          next[idx] = false;
        }
        //Rule 2 : Any live cell with two or three live neighbours lives on to the next generation
        else if (cell == true && live_neighbours <= 3) {
          next[idx] = true;
        }
        //Rule 3: Any live cell with more than three live neighbours dies,as if by overpopulation
        else if (cell == true && live_neighbours > 3) {
          next[idx] = false;
        }
        //Rule 4: Any dead cell with exactly three live neighbours becomes a live cell,as if by reproduction
        else if (cell == false && live_neighbours == 3) {
          next[idx] = true;
        }
      }
    }
    this.cells = next;
  }
  setCells(arr) {
    for (let i = 0; i < arr.length; i++) {
      let idx = this.getIndex(arr[i][0], arr[i][1])
      this.cells[idx] = true;
    }
  }
  print() {
    let rows = [];
    for (let row = 0; row < this.height; row++) {
      let rowString = ''
      for (let column = 0; column < this.width; column++) {
        let idx = this.getIndex(row, column);
        if (this.cells[idx]) {
          rowString += ' x '
        } else {
          rowString += ' o '
        }
      }
      rows.push(rowString);
    }
    console.log(rows.join('\n') + "\n");
  }
}

module.exports = Universe;
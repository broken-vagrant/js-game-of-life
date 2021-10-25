const Universe = require('../lib/Universe');

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

it('check initialization and set cells', () => {
  let universe = new Universe(6, 6, false);
  let alivePos = [(1, 2), (2, 3), (3, 1), (3, 2), (3, 3)]
  universe.setCells(alivePos);
  if (!(universe.cells.length == 36)) throw Error('dimensions not set correctly');
  alivePos.forEach((pos) => {
    if (!universe.cells[universe.getIndex(pos[0], pos[1])]) throw Error("cells didn't set");
  })
})

it('check universe tick', () => {
  let inputUniverse = new Universe(6, 6, random = false);
  inputUniverse.setCells([[1, 2], [2, 3], [3, 1], [3, 2], [3, 3]]);

  let outputUniverse = new Universe(6, 6, random = false);
  outputUniverse.setCells([[2, 1], [2, 3], [3, 2], [3, 3], [4, 2]])

  inputUniverse.tick();


  if (!arraysEqual(inputUniverse.cells, outputUniverse.cells)) throw Error('universe.tick is not working properly');
})
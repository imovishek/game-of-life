const canvas = document.querySelector('canvas');

const Global = {
  values: [
    [1, 1, 1, 0],
    [0, 1, 0, 1],
    [1, 0, 1, 0],
  ],
  row: 100,
  col: 200,
  width: 6,
  primaryColor: 'white',
  secondaryColor: 'black',
  strokeColor: '#dcdcdc',
  map: {}
}

canvas.width = (Global.col + 1) * (Global.width) + 1;
canvas.height = (Global.row + 1) * (Global.width) + 1;

const c = canvas.getContext('2d');




class SeedRandom {
  x0 = 143529867;
  constructor(seed) {
    this.x0 = seed;
  }
  random = () => {
    const a = 263217;
    const c = 41521;
    const m = 1000007;
    return this.x0 = (a * this.x0 + c) % m
  }
}

function init (numberOfIterations, seed) {
  const seedRandom = new SeedRandom(seed);
  Global.oldValues = null;
  Global.values = [[]];
  Global.map = {};
  canvas.width = (Global.col + 1) * (Global.width) + 1;
  canvas.height = (Global.row + 1) * (Global.width) + 1;
  for (let i = 0; i<numberOfIterations; i++) {
    // console.log('seed random', seedRandom.random());
    const randX = seedRandom.random() % Global.row;
    const randY = seedRandom.random() % Global.col;
    const { values } = Global;
    if (!values[randX]) values[randX] = [];
    values[randX][randY] = 1;
  }
};

init(2495, 136);

function onButtonClick () {
  const seed = document.getElementById('randomseed').value;
  const initialValues = document.getElementById('initialValues').value;
  const rows = document.getElementById('rows').value;
  const columns = document.getElementById('columns').value;
  Global.row = Number(rows) || 1;
  Global.col = Number(columns) || 1;
  c.resetTransform();
  init(Number(initialValues), Number(seed));
}

document.getElementById('submitbtn').addEventListener("click", onButtonClick);
document.getElementById('submitbtn2').addEventListener("click", onButtonClick);

const drawSquare = ({ x = 0, y = 0, width = 100, color = Global.primaryColor }) => {
  c.beginPath();
  c.rect(x, y, width, width);
  c.fillStyle = color;
  c.fill();
  c.strokeStyle = Global.strokeColor;
  c.stroke();
}

const isDrawn = (x, y) => {
  return Global.map[`${x}#${y}`];
}

const setDrawn = (x, y) => {
  Global.map[`${x}#${y}`] = true;
}

const drawGrid = ({ row = 2, col = 3, width = 100, margin = 10, values = [[]], oldValues = null}) => {
  for(let index = 0; index < row*col; index++) {
    const xIndex = index % col;
    const yIndex = Math.floor(index/col);
    const value = values[yIndex] ? values[yIndex][xIndex] : 0;
    const fillColor = value ? Global.secondaryColor : Global.primaryColor;
    const oldValue = oldValues ? (oldValues[yIndex] ? oldValues[yIndex][xIndex] : 0) : null;
    const oldColor = oldValue ? Global.secondaryColor : Global.primaryColor;

    const x = xIndex*width + margin;
    const y = yIndex*width + margin;
    if (oldValue === null || fillColor !== oldColor) drawSquare({ x, y, width, color: fillColor });
    else if (!isDrawn(x, y)) {
      setDrawn(x, y);
      drawSquare({ x, y, width, color: fillColor });
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  drawGrid({
    row: Global.row,
    col: Global.col,
    width: Global.width,
    values: Global.values,
    oldValues: Global.oldValues,
  });
}
animate(); // animate




setInterval(() => { // change direction of insects every 1 sec
  // const randX = Math.floor(Math.random() * 10000) % Global.row;
  // const randY = Math.floor(Math.random() * 10000) % Global.col;
  if (!Global.oldValues) {
    Global.oldValues = JSON.parse(JSON.stringify(Global.values));
    return;
  }
  Global.oldValues = JSON.parse(JSON.stringify(Global.values));
  const fx = [1,1,1,-1,-1,-1,0,0];
  const fy = [1,0,-1,1,0,-1,1,-1];
  const { values, oldValues } = Global;
  for (let x = 0; x < Global.row; x++) {
    for (let y = 0; y < Global.col; y++) {
      let aliveCount = 0;
      for (let i = 0; i<8; i++) {
        const a = x + fx[i];
        const b = y + fy[i];
        if (a < 0 || a > Global.row || b < 0 || b > Global.col) continue;
        let alive = 0;
        if (oldValues[a] && oldValues[a][b]) alive = 1;
        aliveCount += alive;
      }
      const isMeAlive = (oldValues[x] && oldValues[x][y]) ? 1 : 0;
      let value = 0;
      const DIE = 0;
      const SURVIVE = 1;

      if (isMeAlive && aliveCount < 2) value = DIE;
      else if (isMeAlive && (aliveCount === 2 || aliveCount === 3)) value = SURVIVE;
      else if (isMeAlive && aliveCount > 3) value = DIE;
      else if (!isMeAlive && aliveCount === 3) value = SURVIVE;
      
      if (!values[x]) values[x] = [];
      values[x][y] = value;
    }
  }
  
}, 10);
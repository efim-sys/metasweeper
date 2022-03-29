const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 950;
canvas.height = 950;

let useNet = true;

let colors = ["#26cc31", "#fed93c", "#ff8200", "#f55343", "#e71919"];

const rect = canvas.getBoundingClientRect();

let grid = new Array(10).fill(null).map(() => new Array(10).fill(null).map(() => [0, 1, 0, 0]));

resolution = 950 / 8;

ctx.font = "100px Arial";

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const hint = grid[y][x][0];

      ctx.beginPath();
      ctx.fillStyle = colors[grid[y + 1][x + 1][1]];

      if (!grid[y + 1][x + 1][0] && grid[y + 1][x + 1][2]) ctx.fillText((grid[y + 1][x + 1][1]).toString(), y * resolution + 0.28 * resolution, x * resolution + 0.7 * resolution);
      ctx.fillStyle = colors[4];
      if (grid[y + 1][x + 1][3] && !grid[y + 1][x + 1][2]) ctx.fillText("⚑", y * resolution + 0.28 * resolution, x * resolution + 0.7 * resolution);
      if (useNet) ctx.strokeStyle = "#1a1a1a";
      else ctx.strokeStyle = "black";
      ctx.rect(y * resolution, x * resolution, resolution, resolution);
      ctx.stroke();
    }
  }
}

async function generateHints() {
  for (let y = 1; y < 9; y++) {
    for (let x = 1; x < 9; x++) {
      grid[x][y][0] = +(getRandomInt(6) == 0);
    }
  }

  for (let y = 1; y < 9; y++) {
    for (let x = 1; x < 9; x++) {
		let a = 0;
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          if (i === 0 && j === 0) {
            continue;
          }
          if (grid[x + i][y + j][0] == 1) {
            a += 1;
          }
        }
      }
	  grid[x][y][1] = a;
    }
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

canvas.addEventListener("click", (e) => {
  var gridX = Math.floor((e.clientX - rect.left) / resolution);
  var gridY = Math.floor((e.clientY - rect.top) / resolution);
  
  if (grid[gridX + 1][gridY + 1][0]) {
    alert("game over!");
    location.reload();
  }
  console.log(gridY);
  console.log(gridX);
  openGrid(gridX + 1, gridY + 1);
  grid[gridX + 1][gridY + 1][2] = 1;
  render();
  checkWin();
});

canvas.addEventListener("contextmenu", (e) => {
  var gridX = Math.floor((e.clientX - rect.left) / resolution);
  var gridY = Math.floor((e.clientY - rect.top) / resolution + 0.3);
  if(!grid[gridX + 1][gridY + 1][2])grid[gridX + 1][gridY + 1][3] = !grid[gridX + 1][gridY + 1][3];
  console.log(gridY);
  console.log(gridX);
  render();
  checkWin();
});

function checkWin() {
  let bombs = 0;
  let flags = 0;
  let a = 0;
  for (let y = 1; y < 9; y++) {
    for (let x = 1; x < 9; x++) {
      a += grid[y][x][2];
      flags += grid[y][x][3];
      bombs += grid[y][x][0];

    }
  }
  console.log("bombs: ");
  console.log(bombs);
  console.log("flags: ");
  console.log(flags-1);
  console.log("opened: ");
  console.log(a);
  if (flags-1 == bombs && a == 64 - bombs) {
    alert("You Win!");
  }
}

function openGrid(x, y) {
	console.log("x: ");
	console.log(x);
	console.log("y: ");
	console.log(y);
	if(grid[x][y][1]==0 && grid[x][y][2]==0){
	grid[x][y][2] = 1;
	for (let i = -1; i < 2; i++) {
			for (let j = -1; j < 2; j++) {
				openGrid(x + i, y + j);
				grid[x+i][y+j][2] = 1;
			}
	}
  }
}

generateHints();

render();

sudokuTable = document.getElementById("sudoku");
document.querySelector("#reset").addEventListener("click", resetSudoku);
document.querySelector("#solve").addEventListener("click", solveSudoku);
let numbers = document.querySelectorAll("#inputTable td");
let cells = document.querySelectorAll("#sudoku td");

let value = "";

let mat=[], rf=[], cf=[], boxf=[];
for (let i = 0; i < 9; i++){
  rf[i] = [];
  cf[i] = [];
  boxf[i] = [];
  mat[i]=[];
  for(let j=0;j<9;j++){
    rf[i].push(false);
    cf[i].push(false);
    boxf[i].push(false);
    mat[i].push(0);
  }
}

function setCurrValue(i) {
  return function () {
    value = i % 10;
  };
}

function setValue(i, j) {
  return function () {
    let prevValue = cells[i * 9 + j].textContent;
    let boxidx = Math.floor(i / 3) * 3 + Math.floor(j / 3);
    if(prevValue!=0)
      rf[i][prevValue - 1] = cf[j][prevValue - 1] = boxf[boxidx][prevValue - 1] = false;
    if (value == 0) {
      cells[i * 9 + j].classList.remove("limeColor");
      cells[i * 9 + j].textContent = "";
      mat[i][j] = value;
    } else if (canPlace(i, j, value)){
      cells[i * 9 + j].classList.add("limeColor");
      cells[i * 9 + j].textContent = value;
      mat[i][j] = value;
    } else{
        if(prevValue!=0)
          rf[i][prevValue - 1] = cf[j][prevValue - 1] = boxf[boxidx][prevValue - 1] = true;
        alert(
          "cannot place " + value + " at cell(" + (i + 1) + ", " + (j + 1) + ")"
        );
      }
  };
}

for (let i = 0; i < 10; i++)
  numbers[i].addEventListener("click", setCurrValue(i + 1));

for (let i = 0; i < 9; i++)
  for (let j = 0; j < 9; j++)
    cells[i * 9 + j].addEventListener("click", setValue(i, j));

// let mat = new Array(9);
// for (let i = 0; i < 9; i++)
//   mat[i] = new Array(9);
// let rf = new Array(9);
// for (let i = 0; i < 9; i++)
//   rf[i] = new Array(9).fill(false);
// let cf = new Array(9);
// for (let i = 0; i < 9; i++)
//   cf[i] = new Array(9).fill(false);
// let boxf = new Array(9);
// for (let i = 0; i < 9; i++)
//   boxf[i] = new Array(9).fill(false);


function resetSudoku() {
  for (let i = 0; i < cells.length; i++){
    cells[i].textContent = "";
    cells[i].style.color = "lime";
  }
  for (let i = 0; i < 9; i++)
    for (let j = 0; j < 9; j++){
      mat[i][j] = 0;
      rf[i][j] = cf[i][j] = boxf[i][j] = false;
    }
}

function canPlace(r, c, y) {
  let boxidx = Math.floor(r / 3) * 3 + Math.floor(c / 3);
  if (rf[r][y - 1] || cf[c][y - 1] || boxf[boxidx][y - 1])
    return false;
  rf[r][y - 1] = cf[c][y - 1] = boxf[boxidx][y - 1] = true;
  return true;
}

function solve(r, c) {
  if (r == 9)
    return true;
  if (mat[r][c] != 0) {
    if (c == 8)
      return solve(r + 1, 0);
    else
      return solve(r, c + 1);
  }
  let boxidx = Math.floor(r / 3) * 3 + Math.floor(c / 3);
  for (let y = 1; y <= 9; y++) {
    if (canPlace(r, c, y)) {
      mat[r][c] = y;
      let success;
      if (c == 8)
        success = solve(r + 1, 0);
      else
        success = solve(r, c + 1);
      if (success){
        cells[r * 9 + c].style.color = "white";
        cells[r * 9 + c].textContent = mat[r][c];
        return true;
      }
      mat[r][c] = 0;
      rf[r][y - 1] = cf[c][y - 1] = boxf[boxidx][y - 1] = false;
    }
  }
  return false;
}

function solveSudoku() {
  for (let i = 0; i < 9; i++)
    for (let j = 0; j < 9; j++) {
      let k = cells[i * 9 + j].textContent;
      if (k == "") mat[i][j] = 0;
      else mat[i][j] = k;
    }
  let solFound = solve(0, 0);
  if (solFound == false)
    alert(
      "No solution to this sudoku found, you can modify or reset this sudoku"
    );
}

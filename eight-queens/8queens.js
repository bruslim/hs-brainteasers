/*jshint node: true*/

'use strict';

var Board = require('./board.js');

// ======================================================================
// grunt of algorthim below



function placeQueens(x,y, numQueens) {
  var board = new Board(8,8);
  // first queen
  board.placeQueen(x,y);
  board.printBoard(
    '[P] Q/T/F/P/R: ' + [
      board.queenCount,
      board.tries,
      board.failures, 
      board.placed,
      board.removed
    ].join('/')
  );
  var success = helper(board, {x:x, y:y}, numQueens);
  if (!success) {
    console.log('FAILURE! No solution found.');
  }
}

var helperCallCount  = 0;
function helper(board, point, target) {
  helperCallCount += 1;
  
  // base case
  if (board.queenCount == target) { return true; }
  
  // assume false
  var placed = false;
  
  // start at 2 away from center (0)
  var radius = 2; 
  
  while(
    ( // check bounds to reduce iterations
      ((point.x - radius) >= 0 || (point.x + radius) <= (board.width)) || 
      ((point.y - radius) >= 0 || (point.y + radius) <= (board.height))
//      ((radius) <= (board.width/2)) || 
//      ((radius) <= (board.height/2))
    ) && !placed
  ) {
  
    var points = openPoints(board, point, radius);
    
    while(points.length > 0 && !placed) {
      
      var newPoint = points.shift();

      placed = board.placeQueen(newPoint.x, newPoint.y);

      if (!placed) { continue; }
    
      board.printBoard(
        '[P] Q/T/F/P/R: ' + [
          board.queenCount,
          board.tries, 
          board.failures,
          board.placed,
          board.removed
        ].join('/')
      );
      
      if (!helper(board, newPoint, target)) {
        board.removeQueen(newPoint.x, newPoint.y);
        board.printBoard(
          '[R] Q/T/F/P/R: ' + [
            board.queenCount,
            board.tries, 
            board.failures,
            board.placed,
            board.removed
          ].join('/')
        );
        placed = false;
      }
    }
    
    // if we couldn't place it, increase our circle
    if (!placed) {
      radius++;
    }
  }
  return placed;
}


// get a set of "open" points to try
// based on the radius given
// for a radius of 2 from the point 'p':
// n y n y n
// y n n n y
// n n p n n
// y n n n y
// n y n y n
function openPoints(board, point, radius) {
  var points = [], x, y, topY, botY, firstX, lastX;
  
  topY   = point.y - radius;
  topY   = topY < 0 ? point.y : topY;
  
  botY   = point.y + radius;
  botY   = botY >= board.height ? point.y : botY;
  
  // compute the first col x value
  firstX = point.x - radius;
  firstX = firstX < 0 ? point.x : firstX;
  
  // compute the last col x value
  lastX = point.x + radius;
  lastX = lastX >= board.width ? point.x : lastX;
  
  
  // easier to break it down into 4 problems
  
  // top and bottom rows 
  for(
    x =  firstX + 1; 
    x <= lastX  - 1; 
    x++
  ) {
    if (x === point.x) { continue; }
    if (topY >= 0) { 
      points.push({x: x, y: topY}); 
    }
    if (botY <  board.height) {
      points.push({x: x, y: botY}); 
    }
  }
  
  // left and right cols
  for(
    y =  topY + 1; 
    y <= botY - 1; 
    y++
  ) {
    if (y === point.y) { continue; }
    if (firstX >= 0) { 
      points.push({x: firstX, y: y}); 
    }
    if (lastX  <  board.width) {
      points.push({x: lastX , y: y}); 
    }
  }
  
  return points;
}


// ======================================================================
// testing functions


function canPlaceTest(height, width) {
  var board = new Board(height, width);
  for(var y = 0; y < height; y++) {
    for(var x = 0; x < width; x++) {
      console.log({x: x, y: y}, board.canPlaceQueen(x, y));
    }
  }
}

function placeAndPrint(board, x,y){
  board.placeQueen(x,y);
  board.printBoard();
}
function removeAndPrint(board, x, y) {
  board.removeQueen(x,y);
  board.printBoard();
}

//var board = new Board(8,8);
//board.printBoard();
//
//placeAndPrint(board, 0,4);
//placeAndPrint(board, 1,0);
//removeAndPrint(board, 1,0);

//removeAndPrint(board, 4,4);


// ======================================================================
// actual call to start algorithm
//console.log(JSON.stringify(process.argv));
placeQueens(
  parseInt(process.argv[2]),
  parseInt(process.argv[3]),
  8);
console.log('= = = = = = = =');
console.log('recursive calls:', helperCallCount);
/*jshint node: true*/

'use strict';

var Board = require('./board.js');

// ======================================================================
// grunt of algorthim below

var queensPlaced, queensRemoved;

function placeQueens(x,y, numQueens) {
  queensPlaced = 0;
  queensRemoved = 0;
  var board = new Board(8,8);
  board.placeQueen(x,y);
  board.printBoard(
    '[P] T:'+ 1 +' P:' + (++queensPlaced) + ' R:' + queensRemoved
  );
  var success = helper(board, {x:x, y:y}, 1, numQueens);
  if (!success) {
    console.log('FAILURE! No solution found.');
  }
}

function helper(board, point, current, target) {
  // base case
  if (current == target) { return true; }
  
  // assume false
  var placed = false;
  
  // start at 2 away from center (0)
  var radius = 2; 
  
  while(
    ( // check bounds to reduce iterations
      (radius) <= (board._width/2) || 
      (radius) <= (board._height/2)
    ) && !placed
  ) {
  
    var points = openPoints(board, point, radius);
    
    while(points.length > 0 && !placed) {
      var newPoint = points.shift();

      placed = board.placeQueen(newPoint.x, newPoint.y);

      if (!placed) { continue; }
    
      board.printBoard(
        '[P] T:'+ (current+1) +' P:' + (++queensPlaced) + ' R:' + queensRemoved
      );
      
      if (!helper(board, newPoint, current+1, target)) {
        board.removeQueen(newPoint.x, newPoint.y);
        board.printBoard(
          '[R] T:'+ (current+1) +' P:' + (queensPlaced) + ' R:' + (++queensRemoved)
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
  var points = [], x, y;
  
  // easier to break it down into 4 problems:
  
  // top row
  y = point.y - radius;
  if (y >= 0) {
    // eliminate the corners (radius-1)
    for(x = point.x - (radius-1); x <= (point.x + (radius -1)); x++) {
      // eliminate the intersecting column (x != point.x)
      if (x >= 0 && x < board._width && x != point.x) {
        // add the point to the list
        points.push({x:x,y:y});
      }
    }
  }
  
  // bottom row
  y = point.y + radius;
  if (y < board._height) {
    for(x = point.x - (radius-1); x <= (point.x + (radius-1)); x++) {
      if (x >= 0 && x < board._width && x != point.x) {
        points.push({x:x,y:y});
      }
    }
  }
  
  // left col
  x = point.x - radius;
  if (x >= 0) {
    for(y = point.y - (radius-1); y < (point.y + (radius-1)); y++) {
      if (y >= 0 && y < board._height && y != point.y) {
        points.push({x:x,y:y});
      }
    }    
  }
  
  // right col
  x = point.x + radius;
  if (x < board._width) {
    for(y = point.y - (radius-1); y < (point.y + (radius-1)); y++) {
      if (y >= 0 && y < board._height && y != point.y) {
        points.push({x:x,y:y});
      }
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


/*jshint node: true*/

'use strict';

function Board(height, width) {
  Object.defineProperties(this, {
    _height: {
      value: height
    },
    _width: {
      value: width
    }
  });

  this.board = [];
  for(var h = 0; h < height; h++) {
    var row = [];
    for(var w = 0; w < width; w++) {
      row.push({
        m: 0,
        q: false
      });
    }
    this.board.push(row);
  }
}

Board.prototype = {
  // O(n)
  _getXpoints: function(y) {
    var points = [];
    for(var x = 0; x < this._width; x++) {
      points.push({x: x, y:y});
    }
    return points;
  },
  // O(n)
  _getYpoints: function(x) {
    var points = [];
    for(var y = 0; y < this._height; y++) {
      points.push({x: x, y:y});
    }
    return points;
  },
  _getDownSlopePoints: function(x,y) {
    // go to top left corner of triangle
    var currentX = x;
    var currentY = y;
    while (currentX > 0 && currentY > 0) {
      currentX--;
      currentY--;
    }
    currentY = Math.max(0,currentY);
    var points = [];
    while(currentY < this._height && currentX < this._width) {
      points.push({
        x: Math.abs(currentX), 
        y: Math.abs(currentY)
      });
      currentX++;
      currentY++;
    }
    return points;
  },
  _getUpSlopePoints: function(x,y) {
    // go to top right corner of triangle
    var currentX = x;
    var currentY = y;
    while (currentX < (this._width-1) && currentY > 0) {
      currentX++;
      currentY--;
    }
    currentY = Math.max(0,currentY);
    var points = [];
    while(currentY < this._height && currentX >= 0) {
      points.push({
        x: Math.abs(currentX), 
        y: Math.abs(currentY)
      });
      currentX--;
      currentY++;
    }
    return points;
  },
  _canPlace: function(point) {
    return this.board[point.y][point.x].m === 0;
  },
  _getCheckPoints: function(x, y) {
    var points = [];
    points = points.concat(this._getXpoints(y));
    points = points.concat(this._getYpoints(x));
    points = points.concat(this._getDownSlopePoints(x,y));
    points = points.concat(this._getUpSlopePoints(x,y));
    return points;
  },
  canPlaceQueen: function(x, y) {
    return this._canPlace({x: x, y: y});
  },
  _markPoints: function(points) {
    points.forEach(function(point){
      this.board[point.y][point.x].m += 1;
    }, this);
  },
  _clearPoints: function(points) {
    points.forEach(function(point) {
      this.board[point.y][point.x].m -= 1;
    }, this);
  },
  _markQueen: function(point, points) {
    this._markPoints(points);
    this.board[point.y][point.x].q = true;
  },
  _clearQueen: function(point, points) {
    this._clearPoints(points);
    this.board[point.y][point.x].q = false;
  },
  placeQueen: function(x,y) {
    var points = this._getCheckPoints(x,y);
    var point = {x: x, y: y};
    if (!this._canPlace(point)){
      return false;
    }
    this._markQueen(point, points);
    return true;
  },
  removeQueen: function(x,y) {
    var value = this.board[y][x];
    if (value.q) {
      var points = this._getCheckPoints(x,y);
      this._clearQueen({x:x,y:y},points);
    }
  },
  printBoard: function(counter) {
    var border = [];
    for(var w = 0; w < this._width; w++){
      border.push('=');
    }
    if (counter !== undefined || counter !== null) {
      border.push(counter);
    }
    console.log(border.join(' '));
    this.board.forEach(function(row){
      var printRow = [];
      row.forEach(function(value) {
        printRow.push((value.q === true) ? 'Q' : value.m.toString(16));
      });
      console.log(printRow.join(' '));
    });
  }
};

var iterations;

function placeQueens(x,y, numQueens) {
  iterations = 0;
  var board = new Board(8,8);
  board.placeQueen(x,y);
  var success = helper(board, {x:x, y:y}, 1, numQueens);
  if (!success) {
    console.log('FAILURE! No solution found.');
  }
}

function helper(board, point, current, target) {
  if (current == target) { return true; }
  var placed = false;
  
  // start at 2 away from center (0)
  var radius = 2; 
  
  while((radius < (board._width/2+1) || radius < (board._height/2+1)) && !placed) {
  
    var points = openPoints(board, point, radius);


    while(points.length > 0 && !placed) {
      var newPoint = points.shift();

      placed = board.placeQueen(newPoint.x, newPoint.y);

      if (!placed) { continue; }
      board.printBoard('PLACED: ' + (++iterations));
      if (!helper(board, newPoint, current+1, target)) {
        board.printBoard('REMOVED: ' + (iterations));
        board.removeQueen(newPoint.x, newPoint.y);
        placed = false;
      }
    }
    
    if (!placed) {
      radius++;
    }
  }
  return placed;
}

function openPoints(board, point, radius) {
  var points = [], x, y;
  
  // top row
  y = point.y - radius;
  if (y >= 0) {
    // eliminate the corners (radius-1)
    for(x = point.x - (radius-1); x <= (point.x + (radius -1)); x++) {
      // eliminate the intersecting column (x != point.x)
      if (x >= 0 && x < board._width && x != point.x) {
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

placeQueens(0,0,8);


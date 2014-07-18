/*jshint node: true*/

'use strict';

// Main board driver, responsible for 
// placing the queen, and marking
// bad spots
var Board = module.exports = function Board(height, width) {
  // use object define properties
  // to create readonly properties
  Object.defineProperties(this, {
    _height: { value: height },
    _width:  { value: width  }
  });
  // init the board
  this.board = [];
  for(var h = 0; h < height; h++) {
    var row = [];
    for(var w = 0; w < width; w++) {
      // use an object to keep track 
      // of the info on the board
      row.push({
        m: 0,    // marker count 
                 // - number of times it has been 
                 //   marked as 'cannot be placed'
        q: false // is it a queen?
      });
    }
    this.board.push(row);
  }
};

Board.prototype = {
  // O(n)
  _getXpoints: function(y) {
    var points = [];
    for(var x = 0; x < this._width; x++) {
      points.push({x:x, y:y });
    }
    return points;
  },
  // O(n)
  _getYpoints: function(x) {
    var points = [];
    for(var y = 0; y < this._height; y++) {
      points.push({x:x, y:y });
    }
    return points;
  },
  _getDownSlopePoints: function(x,y) {
    var currentX = x;
    var currentY = y;
    // go to top left corner via the diagonal
    while (currentX > 0 && currentY > 0) {
      currentX--;
      currentY--;
    }
    var points = [];
    
    // go the bottom left corner via the diagonal
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
   
    var currentX = x;
    var currentY = y;
    
    // go to top right corner via diagonal
    while (currentX < (this._width-1) && currentY > 0) {
      currentX++;
      currentY--;
    }
    
    var points = [];
    
    // go the bottom left corner via diagonal
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
  // O(1)
  _canPlace: function(point) {
    // return false if I can't place a queen at this point
    return this.board[point.y][point.x].m === 0;
  },
  _getCheckPoints: function(x, y) {
    var points = [];
    points = points.concat(this._getXpoints(y));
    points = points.concat(this._getYpoints(x));
    points = points.concat(this._getDownSlopePoints(x,y));
    points = points.concat(this._getUpSlopePoints(x,y));
    // yes there are duplicate points - but its okay
    // there are 4 of the same point
    // the intersection of all 4 lines
    return points;
  },
  // function isn't used in algorithm
  canPlaceQueen: function(x, y) {
    return this._canPlace({x: x, y: y});
  },
  // to 'mark' the points, increment the counter
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

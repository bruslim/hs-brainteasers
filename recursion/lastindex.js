/*jshint node: true */
'use strict';
var items = [1, 2, 5, 4, 6, 5, 2, 7];

function lastIndexOf(searchValue, items) {
  
  return helper(searchValue, items, 0);
  
}

function helper(searchValue, items, currentPosition) {
  
  if (items.length <= 0) {
    return -1;
  }
  
  var value = items.shift(); // dequeue
  
  var match = (value !== searchValue) ? -1 : currentPosition;
  
  var newIndex = helper(searchValue, items, currentPosition + 1);
  
  console.log(value, match, newIndex);
  
  return Math.max(match, newIndex);
  
}

console.log(lastIndexOf(5, items));

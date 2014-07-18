/*jshint node: true */

'use strict';

var fs = require('fs');
var path = require('path');

var filePath = path.join(__dirname, process.argv[2]);

var lines = fs.readFileSync(filePath).toString().split('\n');

var caseCount = parseInt( lines.shift());


var currentCase = 1;
do {
  var amount = parseInt(lines.shift());
  var itemLength = parseInt(lines.shift());
  var items = lines.shift().split(' ').map(function(value) { 
    return parseInt(value, 10);
  });
  //console.log(items)
  var itemLookup = toObject(items, function(value, index){
    if (this[value]) {
      this[value] = this[value].concat([ index ]);
    } else {
      this[value] = [ index ];
    }
  });
  //console.log(itemLookup)
  var diffLookup = toObject(items, function(value, index) {
    value = amount - value;
    if (this[value]) {
      this[value] = this[value].concat([ index ]);
    } else {
      this[value] = [ index ];
    } 
  });
  //console.log(JSON.stringify(items));
  var indexA = -1, indexB = -1;
  for(var key in diffLookup) {
    if (itemLookup[key]) {
      indexA = itemLookup[key].reduce(function(previous, current){
        return Math.min(previous, current);
      });
      
      indexB = diffLookup[key]
        .filter(function(value) {
          return value !== indexA;
        })
        .reduce(function(previous, current){
          return Math.min(previous, current);
        });
      break;
    }
  }
  
  var sum = items[indexA] + items[indexB]
  console.log.apply(
    null,
    ['Case #' + currentCase + ':']
      .concat([indexA, indexB].sort())
  );
  console.log([ 
    '[',
    sum === amount,
    ']',
    items[indexA], 
    '+',
    items[indexB], 
    '=',
    sum, 
    '|' , 
    amount ].join(' '))
  currentCase +=1;
} while(lines.length > 1);

function toObject(items, callback) {
  var ret = new Object();
  items.forEach(callback, ret);
  return ret;
}
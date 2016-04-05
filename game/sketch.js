console.log("111");

var mx = -50;
var my = -50;
var time = 0;

var stem;
var tractor;
var mousePress;
var scaler = 6;
var scalerTrigger = false;

function setup() {
  var canvas = createCanvas(903, 507);
  canvas.parent('canvas');
  canvas.position(0, 0/*windowHeight-450*/);

  tractor = new Tractor();

  // stem = new Stem(200);
  // stem.x = 200;
  // stem.y = 270;
}

function draw() {
  clear();
  background(240);
//  background(200);
  // stem.update();
  // stem.draw(mousePress);
  scale(scaler);
  if (scalerTrigger) {
    if (scaler > 1) {
      scaler *= 0.95;
    }
    else {
      scaler = 1;
    }
  }
  tractor.update();
  tractor.draw();
}

function mousePressed() {
  mousePress = true;
  scalerTrigger = true;
}

function mouseReleased() {
  mousePress = false;
}

function keyPressed() {
  console.log(keyCode);
  if (keyCode === LEFT_ARROW) {
    tractor.setRotation(0);
    event.preventDefault();
  }
  else if (keyCode === RIGHT_ARROW) {
    tractor.setRotation(PI);
    event.preventDefault();
  }
  else if (keyCode == UP_ARROW) {
    tractor.setRotation(PI/2);
    event.preventDefault();
  }
  else if (keyCode == DOWN_ARROW) {
    tractor.setRotation(3/4*TWO_PI);
    event.preventDefault();
  }
  else if (keyCode == 65) { // 'a'
    tractor.addCart();
  }
  else if (keyCode == 66) { // 'b'
    console.log("got b");
    tractor.addItem();
  }
}

// var whereAt = (function() {
//   if (window.pageXOffset != undefined) {
//     return function(ev) {
//       return [ev.clientX + window.pageXOffset,
//         ev.clientY + window.pageYOffset
//       ];
//     }
//   } else return function() {
//     var ev = window.event,
//       d = document.documentElement,
//       b = document.body;
//     return [ev.clientX + d.scrollLeft + b.scrollLeft,
//       ev.clientY + d.scrollTop + b.scrollTop
//     ];
//   }
// })()


// document.ondblclick = function(e) {
//   alert(whereAt(e))
// };

// document.onmousemove = function(e) {
//   var coords = whereAt(e);
//   mx = coords[0];
//   my = coords[1];
// }




fract = function(num) {
  return num - floor(num);
}
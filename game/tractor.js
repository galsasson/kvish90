console.log("bbb");

var Tractor = function()
{
  this.tsize = {x:0, y:0};
  this.trcImg = loadImage("assets/tractorb.png", function() {
    console.log("loaded");
    tractor.tsize = {x:tractor.trcImg.width, y:tractor.trcImg.height};
    tractor.x = tractor.tsize.x*0.2;
    tractor.y = tractor.tsize.y*0.2;
  });
  this.cartImg = loadImage("assets/cartb.png");
  this.x = 0;
  this.y = 0;
  this.time = 0;
  this.boardW = 20;
  this.boardH = 14;
  this.trac = {};
  this.trac.pos = {};
  this.trac.pos.x = 0;
  this.trac.pos.y = 0;
  this.trac.rotation = 0;
  this.trac.moveTimer = 1;
  this.trac.speed = 3;
  this.trac.next = null;

  this.board = [];
  for (var y=0; y<this.boardH; y++) {
    this.board[y] = [];
    for (var x=0; x<this.boardW; x++) {
      if (x == this.trac.pos.x && y == this.trac.pos.y) {
        this.board[y][x] = 1;
      }
      // normal
      var r = random(100);
      if (r < 20) {
        this.board[y][x] = 2;
        continue;
      }

      this.board[y][x] = 0;
    }
  }

  this.setRotation = function(angle) {
    this.trac.rotation = angle;
    this.trac.moveTimer = 0.5/this.trac.speed;
    this.moveTractor();
  }


  this.update = function()
  {
    var mouse = createVector(mouseX-this.x, mouseY-this.y);
    if (this.trac.moveTimer > 0) {
      this.trac.moveTimer -= 1.0/60;
      if (this.trac.moveTimer <= 0) {
        this.moveTractor();
        this.trac.moveTimer = 0.5/this.trac.speed;
      }
    }

  }

  this.draw = function(mousePressed)
  {
    push();
    imageMode(CENTER);
    translate(this.x, this.y);

    for (var y=0; y<this.boardH; y++) {
      for (var x=0; x<this.boardW; x++) {
        if (this.board[y][x]==0) {
          continue;
        }

        push();
        translate(x*this.tsize.x*0.2, y*this.tsize.y*0.2);
        scale(0.2);
        if (this.board[y][x] == 1) {    // Tractor
          // Tractor
          if (this.trac.rotation != 180) {
            rotate(this.trac.rotation/360 * TWO_PI);
          }
          else {
            scale(-1, 1);
          }
          image(this.trcImg);
        }
        else if (this.board[y][x] == 2) {   // Cart
          // Cart
          translate(0, 0.25*this.tsize.y);
          image(this.cartImg);
        }
        pop();
      }
    }
    // var finalDest = p5.Vector.add(this.dst, createVector(0, 20*(noise(this.time)-0.5)));

    // image(this.trcImg);

    pop();
  }

  var clamp = function(v, min, max)
  {
    return (v<min)?min:(v>max)?max:v;
  }

  this.moveTractor = function()
  {
    if (this.trac.rotation == 0) {
      if (this.trac.pos.x <= 0) {
        // reached the end
        return;
      }

      if (this.board[this.trac.pos.y][this.trac.pos.x-1] == 0) {
        this.board[this.trac.pos.y][this.trac.pos.x] = 0;
        this.trac.pos.x--;
        this.board[this.trac.pos.y][this.trac.pos.x] = 1;
      }
    }

    if (this.trac.rotation == 90) {
      if (this.trac.pos.y <= 0) {
        // reached the end
        return;
      }

      if (this.board[this.trac.pos.y-1][this.trac.pos.x] == 0) {
        this.board[this.trac.pos.y][this.trac.pos.x] = 0;
        this.trac.pos.y--;
        this.board[this.trac.pos.y][this.trac.pos.x] = 1;
      }
    }

    if (this.trac.rotation == 180) {
      if (this.trac.pos.x >= this.boardW-1) {
        // reached the end
        return;
      }

      if (this.board[this.trac.pos.y][this.trac.pos.x+1] == 0) {
        this.board[this.trac.pos.y][this.trac.pos.x] = 0;
        this.trac.pos.x++;
        this.board[this.trac.pos.y][this.trac.pos.x] = 1;
      }
    }

    if (this.trac.rotation == 270) {
      if (this.trac.pos.y >= this.boardH-1) {
        // reached the end
        return;
      }

      if (this.board[this.trac.pos.y+1][this.trac.pos.x] == 0) {
        this.board[this.trac.pos.y][this.trac.pos.x] = 0;
        this.trac.pos.y++;
        this.board[this.trac.pos.y][this.trac.pos.x] = 1;
      }
    }
  }
}



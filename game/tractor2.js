console.log("bbb");

var Tractor = function()
{
  this.cartImg = loadImage("assets/cartb.png");
  this.hamburgerImg = loadImage("assets/hamburger.png");
  this.beerImg = loadImage("assets/beer.png");
  this.friesImg = loadImage("assets/fries.png");
  this.icecreamImg = loadImage("assets/icecream.png");
  this.trcImg = loadImage("assets/tractorb.png", function() {
    console.log("loaded");
    tractor.trac.tsize = createVector(tractor.trcImg.width, tractor.trcImg.height);
    tractor.trac.scale = 0.3;
    tractor.trac.size = p5.Vector.mult(tractor.trac.tsize, tractor.trac.scale);
    tractor.trac.pos =  tractor.trac.size.copy();
    tractor.trac.step = tractor.trac.size.copy();
  });
  this.bAddCart = false;
  this.bAddItem = false;

  this.pos = createVector(0, 0);
  this.size = {max:createVector(903-10, 507-10), min:createVector(10, 10)}
  this.time = 0;
  this.trac = {};
  this.trac.size = {};
  this.trac.pos = createVector(0, 0);
  this.trac.prevPos = createVector(0, 0);
  this.trac.rotation = 0;
  this.trac.targetRotation = 0;
  this.trac.moveTimer = 1;
  this.trac.speed = 30;
  this.trac.next = null;
  this.trac.type = 1;
  this.trac.addCart = function(it) {
    if (it.next != null) {
      // console.log("calling");
      it.next.addCart(it.next);
      return;
    }
    it.next = {
      pos: createVector(it.prevPos.x, it.prevPos.y),
      prevPos: createVector(it.prevPos.x, it.prevPos.y),
      scale: 0.3,
      rotation: it.rotation,
      next: null,
      addCart: it.addCart, // copy function
      pull: it.pull,       // copy function
      addItem: it.addItem, // copy function
      type: -1
    };
  };

  this.trac.pull = function(it) {
    if (it.next == null) {
      return;
    }

    it.next.prevPos = it.next.pos.copy();
    // it.next.pos = it.prevPos.copy();

    var step = p5.Vector.sub(it.prevPos, it.next.pos);
    step.mult(0.1);
    it.next.pos.add(step);

    it.next.scale = it.scale;
    it.next.rotation = p5.Vector.sub(it.next.prevPos, it.prevPos).heading();
    // next one pulls
    it.next.pull(it.next);
  };

  this.trac.addItem = function(it, type) {
    if (it.type == -1) {
      it.type = type;
      return true;
    }
    if (it.next != null) {
      return it.next.addItem(it.next, type);
    }
    return false;
  };


  this.setRotation = function(angle) {
    this.trac.moveTimer = 0.5/this.trac.speed;
    this.trac.targetRotation = angle;
    this.trac.rotation = this.trac.targetRotation;
    this.moveTractor();
  }

  this.addCart = function() {
    this.bAddCart = true;
  }

  this.addItem = function() {
    this.bAddItem = true;
  }

  this.getTextureFor = function(type) {
    switch (type) {
      case 0:
        return this.hamburgerImg;
      case 1:
        return this.friesImg;
      case 2:
        return this.beerImg;
      case 3:
      default:
        return this.icecreamImg;
    }
  }

  this.update = function()
  {
    // move timer
    if (this.trac.moveTimer > 0) {
      this.trac.moveTimer -= 1.0/60;
      if (this.trac.moveTimer <= 0) {
        // do rotation
        if (this.trac.targetRotation != this.trac.rotation) {
          this.trac.rotation = this.trac.targetRotation;
        }

        // move
        this.moveTractor();
        if (this.bAddCart == true) {
          this.trac.addCart(this.trac);
          this.bAddCart = false;
        }
        if (this.bAddItem == true) {
          this.trac.addItem(this.trac, floor(random(4)));
          this.bAddItem = false;
        }
        this.trac.moveTimer = 0.5/this.trac.speed;
      }
    }
  }

  this.draw = function(mousePressed)
  {
    push();
    imageMode(CENTER);
    translate(this.pos.x, this.pos.y);

    // draw tractor
    push();
    translate(this.trac.pos.x, this.trac.pos.y);
    scale(this.trac.scale);
    if (this.trac.rotation != PI) {
      rotate(this.trac.rotation);
    }
    else {
      scale(-1, 1);
    }
    image(this.trcImg,1.7*this.trac.size.x, -1.23*this.trac.size.y);
    // fill(255, 0, 0);
    // ellipse(0, 0, 30, 30);
    pop();

    // draw carts
    var next = this.trac.next;
    while (next != null) {
      push();
      translate(next.pos.x, next.pos.y);
      scale(next.scale);
      if (abs(next.rotation - PI) > 0.01) {
        rotate(next.rotation);
      }
      else {
        scale(-1, 1);
      }
      // if (next.type == 2) {
        // translate(0, );
        image(this.cartImg, this.cartImg.width*0.5, -0.5*next.scale*this.cartImg.height);
        // fill(0, 0, 255);
        // ellipse(0, 0, 30, 30);
      // }

      if (next.type != -1) {
        scale(0.4);
        var tex = this.getTextureFor(next.type);
        image(tex, 400, -110-0.5*tex.height);
      }

      pop();

      next = next.next;
    }


    pop();
  }

  var clamp = function(v, min, max)
  {
    return (v<min)?min:(v>max)?max:v;
  }

  this.moveTractor = function()
  {
    var vec = createVector(-1, 0);
    vec.rotate(this.trac.rotation);
    vec.x *= this.trac.step.x*0.1;
    vec.y *= this.trac.step.x*0.1;

    var targetPos = p5.Vector.add(this.trac.pos, vec);
    if (targetPos.x < this.size.min.x || targetPos.x > this.size.max.x || targetPos.y < this.size.min.y || targetPos.y > this.size.max.y) {
      return;
    }
    this.trac.prevPos = this.trac.pos.copy();
    this.trac.pos.add(vec);
    this.trac.pull(this.trac);
  }
}



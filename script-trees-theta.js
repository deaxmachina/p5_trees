// Multple trees where trees come from a Tree object 
// and the angle theta is tied to the mouse movement 


let theta; 
let branchStartPosYs = []
let THETA = 30;

const NUM_BRANCHES = 330; 
const RECURSION_FACTOR = 0.66; 

let ang = 0;

function setGradient(c1, c2) {
  // noprotect
  noFill();
  for (var y = 0; y < height; y++) {
    var inter = map(y, 0, height, 0, 1);
    var c = lerpColor(c1, c2, inter);
    stroke(c);
    line(0, y, width, y);
  }
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  THETA = radians(THETA)
}

function draw() {
  //background("#d8e2dc")
  c1 = color(254, 197, 187)
  c2 = color(161, 186, 171);
  setGradient(c1, c2);

  frameRate(30)
  strokeWeight(1)
  stroke(255)
  // pick angle between 0 and some angle corresponding to mouse pos
  // s.t. when we move the mouse up and down the trees 'bloom' 
  // convert it to radians 
  theta = radians((mouseX / width) * 30); // we need it to be in radians
  push()
  const tree = new Tree(radians(ang), NUM_BRANCHES, width/2, 50)
  tree.drawTree()
  pop() 

  ang += 3;
  if (radians(ang) > THETA) {
    ang = degrees(THETA)
  }
}



class Tree {
  constructor(theta, h, startPosX, branchStartPosY) {
    this.theta = theta // dynamic angle of branch rotation
    this.h = h; // number of branches
    this.startPosX = startPosX // x position of the tree
    this.branchStartPosY = branchStartPosY // y postion of the tree i.e. where the trunk ends and branching starts
  }

  // draw the whole tree i.e. single trunk and recursive branches
  drawTree() {
    this.drawTreeTrunk()
    this.drawBranch(this.h)
  }

  drawTreeTrunk() {
    // start tree from bottom of screen and at starting X pos 
    translate(this.startPosX, height);
    // draw line of the trunk i.e. to the starting branches y pos 
    line(0, 0, 0, -this.branchStartPosY)
    // move to the end of the line i.e. end of the trunk
    translate(0, -this.branchStartPosY)
  }

  drawBranch(h) {
    // each branch is 2/3 the size of the prev one 
    h *= RECURSION_FACTOR
    if (h > 1) {
      // right branch
      push();
      rotate(this.theta)
      if (h > 200) {
        line(0, 0, 0, -h-100)
        translate(0, -h-100)
      } else {
        line(0, 0, 0, -h-1)
        translate(0, -h-1)
      }

      this.drawBranch(h)
      pop()
      // left branch 
      push()
      rotate(-this.theta)
      line(0, 0, 0, -h)
      translate(0, -h)
      this.drawBranch(h)
      pop()
    }
  }
}
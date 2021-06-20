// Multple trees where trees come from a Tree object 
// and the angle theta is tied to the mouse movement 


let theta; 
let branchStartPosYs = []

const NUM_BRANCHES = 200; 
const RECURSION_FACTOR = 0.66; 


function setup() {
  createCanvas(1200, 700);
  branchStartPosYs = [
    Math.floor(random(50, 200)),
    Math.floor(random(50, 250)),
    Math.floor(random(50, 250)),
    Math.floor(random(50, 200)),
    Math.floor(random(50, 250))
  ]
}

function draw() {
  background("#84a59d")
  frameRate(30)
  strokeWeight(1)
  stroke(255)
  // pick angle between 0 and some angle corresponding to mouse pos
  // s.t. when we move the mouse up and down the trees 'bloom' 
  // convert it to radians 
  theta = radians((mouseY / height) * 30); // we need it to be in radians

  for (let i = 0; i < branchStartPosYs.length; i ++) {
    push()
    const tree = new Tree(theta, NUM_BRANCHES, 250*i+100, branchStartPosYs[i])
    tree.drawTree()
    pop() 
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
      line(0, 0, 0, -h)
      translate(0, -h)
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
// Tress that either grow or appear one after the other 
// and chnaging colour background


let branchStartPosYs = []
let trees = []


let THETA = 15;
const NUM_BRANCHES = 200; 
const RECURSION_FACTOR = 0.65; 
const NUM_TREES = 25;
const FRAME_RATE = 3;
const TREE_SPACING = window.innerWidth/NUM_TREES

let j = 0;
let ang = 0;
let yGrowthFactor = 0;

let bg;
let colourScale;

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
  for (let i = 0; i < NUM_TREES; i ++) {
    branchStartPosYs.push(
      Math.floor(random(20*(i%3), 200*(i%3)+10))
    )
  }
  THETA = radians(THETA)
  colourScale = chroma.scale(['#ff8600', '#219ebc']).domain([0, branchStartPosYs.length])
}


function draw() {
  // background(`rgb(
  //   ${Math.floor(colourScale(j)["_rgb"][0])}, 
  //   ${Math.floor(colourScale(j)["_rgb"][1])}, 
  //   ${Math.floor(colourScale(j)["_rgb"][2])})
  //   `)
  c1 = color(Math.floor(colourScale(j)["_rgb"][0]), Math.floor(colourScale(j)["_rgb"][1]), Math.floor(colourScale(j)["_rgb"][2]))
  c2 = color(161, 186, 171);
  setGradient(c1, c2);

  frameRate(FRAME_RATE)
  strokeWeight(1)
  stroke(255)
  for (let i = 0; i < j; i ++) {
    push()
    const tree = new Tree(TREE_SPACING*i + TREE_SPACING+30)
    tree.drawTreeTrunk(yGrowthFactor*branchStartPosYs[i])
    tree.drawBranch(NUM_BRANCHES, radians(max(10, (mouseX / width) * 20))) 
    pop() 
  }

  ang += 3;
  if (radians(ang) > THETA) {
    ang = degrees(THETA)
  }

  j += 1;
  if (j > branchStartPosYs.length) {
    j = branchStartPosYs.length
  }

  yGrowthFactor += 0.05;
  if (yGrowthFactor > 1) {
    yGrowthFactor = 1
  }
}



class Tree {
  constructor(startPosX) {
    this.startPosX = startPosX // x position of the tree
  }

  drawTreeTrunk(branchStartPosY) {
    // start tree from bottom of screen and at starting X pos 
    translate(this.startPosX, height);
    // draw line of the trunk i.e. to the starting branches y pos 
    line(0, 0, 0, -branchStartPosY)
    // move to the end of the line i.e. end of the trunk
    translate(0, -branchStartPosY)
  }

  drawBranch(h, theta) {
    // each branch is 2/3 the size of the prev one 
    h *= RECURSION_FACTOR
    if (h > 1) {
      // right branch
      push();
      rotate(theta)
      line(0, 0, 0, -h)
      translate(0, -h)
      this.drawBranch(h, theta)
      pop()
      // left branch 
      push()
      rotate(-theta)
      line(0, 0, 0, -h)
      translate(0, -h)
      this.drawBranch(h, theta)
      pop()
    }
  }
}
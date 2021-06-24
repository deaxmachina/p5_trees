// Tress that either grow or appear one after the other 
// and chnaging colour background


let branchStartPosYs = []
let trees = []


let THETA = 15;
const NUM_BRANCHES = 190; 
const RECURSION_FACTOR = 0.65; 
const NUM_TREES = 25;
const FRAME_RATE = 3;
const TREE_SPACING = window.innerWidth/NUM_TREES - 5

//let j = 0;
//let ang = 0;
let yGrowthFactor = 0; // how fast the trees grow 
// for the background
let bg;
let colourScale;


/// CO2 sequestration ///
let infoContainer = document.querySelector(".info-container")
let counterCO2 = document.querySelector('#co2-counter') // dom element that keeps track of the CO2 count
let counterNumCO2 = 0; // the count of CO2 that goes inside the counter
let counterTrees = document.querySelector('#trees-counter') // dom element that keeps track of the number of trees
let counterNumTrees = 0;

let co2PerTreePerYear = 29.4

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
      Math.floor(random(
        (i%3)+50, 
        Math.min(350, 200*(i%3))
      ))
    )
  }
  THETA = radians(THETA)
  colourScale = chroma.scale(['#ff8600', '#219ebc']).domain([0, branchStartPosYs.length])
  counterCO2.innerText = counterNumCO2;
}


function draw() {
  // colour changes linearly with the frame count
  c1 = color(Math.floor(
    colourScale(frameCount)["_rgb"][0]), 
    Math.floor(colourScale(frameCount)["_rgb"][1]), 
    Math.floor(colourScale(frameCount)["_rgb"][2]))
  c2 = color(161, 186, 171);
  setGradient(c1, c2);
  infoContainer.style.backgroundColor = c1;

  frameRate(FRAME_RATE)
  strokeWeight(1)
  stroke(255)

  // at each frame, i.e. full run of the draw function, we draw as many trees as number of frames so far
  for (let i = 0; i < frameCount; i ++) {
    push()
    const tree = new Tree(TREE_SPACING*i + TREE_SPACING+30)
    tree.drawTreeTrunk(yGrowthFactor*branchStartPosYs[i])
    tree.drawBranch(NUM_BRANCHES, radians(max(10, (mouseX / width) * 20))) 
    //tree.drawBranch(NUM_BRANCHES, THETA)
    pop() 
  }

  // ang += 3;
  // if (radians(ang) > THETA) {
  //   ang = degrees(THETA)
  // }


  // when we draw all the trees, stop drawing any more
  if (frameCount > branchStartPosYs.length) {
    frameCount = branchStartPosYs.length
  }

  yGrowthFactor += 0.04;
  if (yGrowthFactor > 1) {
    yGrowthFactor = 1
  }

  // displayed numbers 
  // C02 numbers 
  counterCO2.innerText = Math.round(counterNumCO2)
  counterNumCO2 +=co2PerTreePerYear;
  // tree numbers 
  counterTrees.innerText = counterNumTrees*10;
  counterNumTrees +=1;
  // if CO2 numbers exceed the total num trees x co2 per tree, stop
   if (counterNumCO2 > NUM_TREES*co2PerTreePerYear) {
    counterNumCO2 = NUM_TREES*co2PerTreePerYear
   }
  // likewise, if the number of trees exceeds the total number of trees, stop
   if (counterNumTrees > NUM_TREES) {
    counterNumTrees = NUM_TREES
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


/// more info button ///

const infoHTML = `
This project was made just for fun! 
<br><br>
<span class="list-title">What I learnt in the process: </span>
<br>
<ul class="info-list">
  <li>It really matters what kinds of trees you have where -  in some cases you might 
  get increased CO2 by planting the wrong type of trees!</li>
  <li>A lot of factors come into play: local environment, 
  age of the trees, other species around them, time of day or year...
  </li>
</ul>
<br>
It's a massive topic that this project doesn't attempt to even begin to answer! I hope it peaks your interest though :)
<br>
- Dea
`
const moreInfoContainer = document.querySelector(".more-info")
moreInfoContainer.addEventListener('click', () => {
  moreInfoContainer.classList.toggle("expand")
  if (moreInfoContainer.classList.contains("expand")) {
    setTimeout(() => {moreInfoContainer.innerHTML = infoHTML}, 500)
    
  } else {
    moreInfoContainer.innerHTML = "🌱"
  }
})



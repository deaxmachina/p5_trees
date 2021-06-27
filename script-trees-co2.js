// Tress that either grow or appear one after the other 
// and chnaging colour background


let branchStartPosYs = []
let trees = []


let THETA = 15;
const NUM_BRANCHES = 100; 
const RECURSION_FACTOR = 0.65; 
const NUM_TREES = 45;
const FRAME_RATE = 3;
const TREE_SPACING = window.innerWidth/NUM_TREES - 4

//let j = 0;
//let ang = 0;
let yGrowthFactor = 0; // how fast the trees grow 
// for the background
let bg;
let colourScale;


/// CO2 sequestration ///
let infoContainer = document.querySelector(".info-container")
let counterCO2 = document.querySelector('#co2-counter') // dom element that keeps track of the ppm co2 count
let counterNumCO2 = 419; // the ppm co2 in cube number that goes inside the counter
let counterTrees = document.querySelector('#trees-counter') // dom element that keeps track of the number of trees
let counterNumTrees = 0;

// various constants we need
let co2PerTreePerYear = 29.4
let totalWeightCo2inCubeKg = 825178
let co2MolecularWeight = 0.0440095
let totalMolesOfGas =  44642857143 
function calculatePpmCo2(numTrees) {
  return (((totalWeightCo2inCubeKg - co2PerTreePerYear*numTrees)/co2MolecularWeight)/totalMolesOfGas)*1000000
} 

// checks 
console.log("co2 for 9300 tree: ", calculatePpmCo2(9300)) 
// console.log("co2 for 500 tree: ", calculatePpmCo2(500)) 
// console.log("co2 for 1000 tree: ", calculatePpmCo2(1000)) 
// console.log("co2 for 2000 tree: ", calculatePpmCo2(2000)) 
// console.log("co2 for 3000 tree: ", calculatePpmCo2(3000))  
// console.log("co2 for 4000 tree: ", calculatePpmCo2(4000)) 
// console.log("co2 for 4500 tree: ", calculatePpmCo2(4500)) 



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
        20*(i%3)+50, 
        Math.min(450, 450*(i%3))
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
    const tree = new Tree(TREE_SPACING*i + TREE_SPACING+60)
    tree.drawTreeTrunk(yGrowthFactor*branchStartPosYs[i])
    //tree.drawBranch(NUM_BRANCHES, radians(max(10, (mouseX / width) * 20))) 
    tree.drawBranch(NUM_BRANCHES, THETA)
    pop() 
  }

  // ang += 3;
  // if (radians(ang) > THETA) {
  //   ang = degrees(THETA)
  // }


  // when we draw all the trees, stop drawing any more
  if (frameCount > branchStartPosYs.length) {
    frameCount = branchStartPosYs.length
    noLoop()
  }

  yGrowthFactor += 0.02;
  if (yGrowthFactor > 1) {
    yGrowthFactor = 1
  }

  // displayed numbers 
  const numRealTrees = frameCount*NUM_BRANCHES // this is number of actual trees
  // C02 numbers -- ppm co2 in cube
  counterCO2.innerText = Math.round(counterNumCO2)
  counterNumCO2 = calculatePpmCo2(numRealTrees)
  // tree numbers 
  counterTrees.innerText = numRealTrees; 
  counterNumTrees +=1;
  // if the number of trees exceeds the total number of trees, stop
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
* Here 1 drawn tree (has 100 branches) = 100 real trees
<br>
* The tee is a silver oak. Different trees will give different numbers.  
<br><br>
<ul class="info-list">
  <li>
    The current ppm CO<span class="two">2</span> in the air is around 419 
    – the highest ever (<a href="https://www.co2.earth/daily-co2" target="_blank">source</a>) (note: depends where and when you measure, of course). 
    Scientists recommend ~350 ppm – this is the number depicted here. 
    Pre-industrial levels were around 280 ppm. 
    Check out this very brief 
    explanation: <a href="https://climatekids.nasa.gov/health-report-air/" target="_blank">What is ppm CO<span class="two">2</span></a>.
  </li>
  <li>
    In other words, In a closed system, we will need over 4,500 trees in a square km (or a cube actually, 
    but the trees are on the ground) to get from our current ppm C0<span class="two">2</span> levels to the recommended level. 
    And over double that number to reach pre-industrial levels! 
  </li>
  <li>
    The caveat is that such a close system doesn’t exist in reality. Plus, something I learnt doing this project 
    – having the right kind of tree in the right kind of locality really matters. The environment, other plant species, 
    age of the trees, as well as many other factors come into play. 
  </li>
</ul>
<br>
This project was made just for fun, and I am very far from an expert. I did find it interesting to see just how many trees 
it would take to ‘clear the air’. I hope it gives you something to think about, too. 
<br><br>
Code for recursive tree based on Dan Shiffman in the <a href="https://p5js.org/examples/simulate-recursive-tree.html" target="_blank">p5 docs</a>
<br>
<a href="https://github.com/deaxmachina/p5_trees/blob/main/Tree_hug.xlsx" target="_blank">Data</a> collection by Rob Hewlett. 🌳
<br>
Made with 🤍 by Dea. 
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














// global variables

// store a list of points
const pointsList;
var total_points = 30;

function setup() {
  width = windowWidth;
  height = windowHeight;
  let canvas = createCanvas(width, height);
  canvas.parent('sketch-container');

  pointsList = new Set();

  // makes draw only get called once
  //noLoop();
}

function draw() {

  if (mouseIsPressed) {
  //  fill(0);
  } else {
  //  fill(255);
  }

  //ellipse(mouseX, mouseY, 80, 80);

  // change the frameRate
  if () {

  }

  strokeWeight(10);

  calculateVoronoi();


}


function calculateVoronoi() {
  // use mouse location as a point???

  // calculate new voronoi points
  randomizeVoronoi();

  pointsList.forEach( function(p) {
    point(p.xval,p.yval);
  })

  // first calculate Delunay triangulation by using the Bowyer-Watson algorithm
  // https://www.baeldung.com/cs/voronoi-diagram
  //



}

// total_points comes from user input ?
// calculate new voronoi points
function randomizeVoronoi() {

  pointsList.clear();

  // create a random
  for (let i = 0; i < total_points; i++) {
    var x = getRandomInt(0, width);
    var y = getRandomInt(0, height);
    var z = getRandomInt(0, height);

    const point1 = new Point(x,y,z);

    pointsList.add(point1);
  }
}

function Point(x, y, z) {
    this.xval = x;
    this.yval = y;
    this.zval = z;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

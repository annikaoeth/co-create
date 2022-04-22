var fluid;
p5.disableFriendlyErrors = true;

function setup() {
  // put setup code here
  //colorMode(HSB);
  createCanvas(N * SCALE, N * SCALE);
  fluid = new Fluid(0.1, 0.000001, 0.000001);
}

function mouseDragged() {
  fluid.addDensity(Math.floor(mouseX/SCALE), Math.floor(mouseY/SCALE), 360);
  fluid.addVelocity(Math.floor(mouseX/SCALE), Math.floor(mouseY/SCALE), (mouseX - pmouseX), (mouseY - pmouseY) );

}

function draw() {
  background(0);
  fluid.step();
  fluid.renderD();
}

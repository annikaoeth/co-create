/*
 * @name Applying Shaders as Textures
 * @description Shaders can be applied to 2D/3D shapes as textures. 
 * To learn more about shaders and p5.js: https://itp-xstory.github.io/p5js-shaders/
 */

let theShader;
let shaderTexture;

let theta = 0;

let x;
let y;
let outsideRadius = 200;
let insideRadius = 100;


function preload(){
  // load the shader
  theShader = loadShader('texture.vert','basic.frag');
}

function setup() {
  // disables scaling for retina screens which can create inconsistent scaling between displays
  //pixelDensity(1);
  // shaders require WEBGL mode to work

  width = windowWidth;
  height = windowHeight;
  let canvas = createCanvas(width, height, WEBGL);
  noStroke();

  // initialize the createGraphics layers
  shaderTexture = createGraphics(710, 400, WEBGL);

  // turn off the createGraphics layers stroke
  shaderTexture.noStroke();

   x = -50;
   y = 0;
}

function draw() {

  // instead of just setting the active shader we are passing it to the createGraphics layer
  shaderTexture.shader(theShader);

  // here we're using setUniform() to send our uniform values to the shader
  theShader.setUniform("resolution", [width, height]);
  theShader.setUniform("time", millis() / 1000.0);
  theShader.setUniform("mouse", [mouseX, map(mouseY, 0, height, height, 0)]);

  // passing the shaderTexture layer geometry to render on
  shaderTexture.rect(0,0,width,height);

  background(255);
  
  //pass the shader as a texture
  texture(shaderTexture);
  
  translate(-150, 0, 0);
  push();
  rotateZ(theta * mouseX * 0.0001);
  rotateX(theta * mouseX * 0.0001);
  rotateY(theta * mouseX * 0.0001);  
  theta += 0.05;
  sphere(125);
  pop();
  
  /* when you put a texture or shader on an ellipse it is rendered in 3d,
     so a fifth parameter that controls the # vertices in it becomes necessary,
     or else you'll have sharp corners. setting it to 100 is smooth. */
  let ellipseFidelity = int(map(mouseX, 0, width, 8, 100));
  ellipse(260, 0, 200, 200, ellipseFidelity);
}

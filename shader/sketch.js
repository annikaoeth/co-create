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
var f;
var amp = 1.0;

let input_a, button_a, greeting;
let slider_1, slider_2, slider_3;
let slider_amp, slider_freq;
let select1;



function preload(){
  // load the shader
  theShader = loadShader('basic.vert','basic.frag');
  //load font
}

function updateAmp(){
  amp = input_a.value();

  amp = 40.0;

}


function setup() {
  fill('#ED225D');
  textAlign(CENTER);
  textSize(50);
  slider_1 = createSlider(0, 100, 1);
  slider_1.position(320, 0);
  slider_2 = createSlider(0, 100, 0);
  slider_2.position(320, 30);
  slider_3 = createSlider(0, 100, 30);
  slider_3.position(320, 60);

  // input_a = createInput();
  // input_a.position(620, 30);
  // button_a = createButton('enter number');
  // button_a.position(input_a.x + input_a.width, 30);
  // button_a.mouseClicked(updateAmp);
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
   text('red', 20, 20);
   text('green', slider_2.x * 2 + slider_2.width, 65);
   text('blue', slider_3.x * 2 + slider_3.width, 95);
   //select1 = createSelect();
   //If 1 param, it's both content AND
   //value. Values treated as strings.
   //select1.option(["option 1"], [1]);
   //select1.option(["option 2"], [2]);
   //select1.option(["option 3"], [3]);
   //If changed, call select1Changed 
   //select1.changed(select1Changed);
   //select1.position(150,30);
}

function draw() {

  // instead of just setting the active shader we are passing it to the createGraphics layer
  shaderTexture.shader(theShader);
  const r = slider_1.value();
  const g = slider_2.value();
  const b = slider_3.value();
  
  
  // here we're using setUniform() to send our uniform values to the shader
  theShader.setUniform("resolution", [width, height]);
  theShader.setUniform("time", millis() / 1000.0);
  theShader.setUniform("mouse", [mouseX, map(mouseY, 0, height, height, 0)]);
  theShader.setUniform("rgb", [r/100.0,g/100.0,b/100.0]);
  theShader.setUniform("a", amp);
  theShader.setUniform("t", 0.0);
  theShader.setUniform("f", 1.0);
  theShader.setUniform("f_add", 1.0);

  // passing the shaderTexture layer geometry to render on


  background(r, g, b);

  //pass the shader as a texture
  texture(shaderTexture);
  push();
  rotateX(theta * 0.0001 + (millis() / 1000.0));
  rotateY(theta * 0.0001 + (millis() / 1000.0));  
  theta += 0.05;
  sphere(125);
  shaderTexture.rect(0,0,width,height);
  pop();  
  rect(-width*0.4,-height*0.4,width*0.8,height*0.8);
}


//callback fcn for select1
function select1Changed() {
  switch (select1.value()) {
    case 1:
      theShader = loadShader('basic.vert','basic.frag');
      break;
    case 2:
      theShader = loadShader('basic.vert','basic.frag');
      break;
    case 3:
      theShader = loadShader('basic.vert','basic.frag');
      break;
  }
}
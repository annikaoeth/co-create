// env vars
var theta = 0;
var init_len = 100;
var shrink_factor = 0.67;
var rate = 0.002;

// sliders
//var theta_slider;
var init_slider;
var shrink_slider;
var speed_slider;

function setup() {
  // put setup code here
  createCanvas(800,800);

  textSize(15);

  //theta_slider = createSlider(0, PI, PI/4, 0.01);
  init_slider = createSlider(0, 200, 100);
  init_slider.position(20,20);
  shrink_slider = createSlider(0, 75, 50, 1);
  shrink_slider.position(20,50);
  speed_slider = createSlider(0,0.01,0.002,0.001);
  speed_slider.position(20,80);


  theta = 0;
}

function draw() {
  background(51);
  noStroke();
  //theta = theta_slider.value();
  init_len = init_slider.value();
  shrink_factor = shrink_slider.value() / 100;
  rate = speed_slider.value();
  theta += rate;
  fill(255);
  text('Tree Height', init_slider.x + init_slider.width + 10, 35);
  text('Num. Branches', shrink_slider.x + shrink_slider.width + 10, 65);
  text('Cycle Rate', speed_slider.x + speed_slider.width + 10, 95);

  // put drawing code here


  fill(25);
  stroke(25);
  rect(0,height-100,width,100);
  stroke(255);
  //line(200,height,100,init_len);
  translate(width/2,height-100);
  branch(init_len);

}

function branch(len){
  line(0,0,0,-len);
  translate(0,-len);

  if(len>4){

    push();
    rotate(theta);
    branch(len*shrink_factor);
    pop();

    push();
    rotate(-theta);
    branch(len*shrink_factor);
    pop();

  }

}

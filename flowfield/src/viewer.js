const THREE = require('three');
const createVignetteBackground = require('three-vignette-background');
const MeshLine = require('three.meshline').MeshLine;
const MeshLineMaterial = require('three.meshline').MeshLineMaterial;
const MeshLineRaycast = require('three.meshline').MeshLineRaycast;

require('three/examples/js/controls/OrbitControls');

const IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

var NUM_ROWS = 10;
var NUM_COLS = 10;
var NUM_FLOORS = 10;

class Viewer {
  /**
   * @param {Element} el
   */
  constructor (el) {
    this.el = el;

    this.scene = new THREE.Scene();

    var Params = function() {
      this.numLines = 100;
      this.lineWidth = 0.5;
      this.dashArray = 0.4;
      this.dashRatio = 0.9;
        this.opacity = 0.8;
      this.taper = 'parabolic';
        this.catmullpoints = 100;
      this.animateDash = true;
      this.update = function() {
        this.clearLines();
        this.drawLines();
      }
    };
    this.params = new Params()


    // Base camera
    this.camera = new THREE.PerspectiveCamera(75,  el.clientWidth /  el.clientHeight, 0.1, 100)
    this.camera.position.x = 0
    this.camera.position.y = 10
    this.camera.position.z = 0
    this.camera.lookAt(0,0,0)
    this.scene.add(this.camera)
    
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setClearColor( 0xF2D5DE );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( el.clientWidth, el.clientHeight );

    this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = -1;
    this.controls.enablePan = false;
    this.controls.minDistance = 1;
    this.controls.maxDistance = 90;
    
    this.background = createVignetteBackground({
       aspect: this.camera.aspect,
      colors: ['#FFFFFF', '#765754']
    });
    this.scene.add(this.background);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(100, 100, 50);
    this.camera.add(dirLight);
    const ambLight = new THREE.AmbientLight(0x404040, 2);
    this.camera.add(ambLight);

    this.el.appendChild(this.renderer.domElement);

    
  this.particlesGeometry = new THREE.BufferGeometry()
// const position = new Float32Array(quantityPoints*3)
// position.forEach((e,i) => {position[i] = Math.random()})

  this.points = [];
  this.angles = [];
  this.quaternions = [];
  this.lines = [];

let n  = 0
for(var i = 0; i <NUM_ROWS; i+=0.5){
    for(var j = 0; j <NUM_COLS; j+=0.5){
        for(var k = 0; k <NUM_FLOORS; k+=0.5){
            //console.log("%f %f %f", i-NUM_ROWS/2, k-NUM_FLOORS/2, j-NUM_COLS/2)
            //console.log("ind: %d %d %d", i, k ,j)
            //console.log("ind: %d", n)
            //n++
            this.points.push([i-NUM_ROWS/2, k-NUM_FLOORS/2 ,j-NUM_COLS/2]);
            const X = (i / NUM_ROWS) * Math.PI
            const Y = (j / NUM_COLS) * Math.PI
            const Z = (k / NUM_COLS) * Math.PI

            this.angles.push([X, Y, Z])
            const q = new THREE.Quaternion()
            q.setFromEuler(new THREE.Euler( X, Y, Z, 'XYZ' ))
            this.quaternions.push(q)
        }
    }
}

var particleArr = this.points.flat(2);
particleArr = Float32Array.from(this.points);
//particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particleArr ,3));

this.testMaterial = new THREE.ShaderMaterial({
    //vertexShader: testVertexShader,
    //fragmentShader: testFragmentShader,
    // size: .02,
    // sizeAttenuation: true,
    uniforms: {
        // uDownload: {value: 0.0},
        uTime: {value: 0.0},
    },
    depthWrite: false,
    transparent: true,
    alphaTest: 0.5,
    // sizeAttentuation: true,
    // blending: THREE.AdditiveBlending
});

this.meshLineMaterials = [];
this.colors = ['#A2CCB6', '#FCEEB5', '#EE786E', '#e0feff', 'lightpink', 'lightblue'];

const geometry = new THREE.ConeGeometry( .02 , .07, 16 );
const material = new THREE.MeshBasicMaterial( {color: new THREE.Color( 'black' ), opacity: 0.8, transparent: true,
} );
const cone = new THREE.Mesh( geometry, material );
cone.position.set( 0, 0, 0 );
const cylinderGeo = new THREE.CylinderGeometry( 0.01, 0.01, 0.1, 16 );
const cylinder = new THREE.Mesh(cylinderGeo, material );
cylinder.position.set( 0, -0.08, 0 );
const arrow = new THREE.Group();
arrow.add( cone );
arrow.add( cylinder );

//add arrows to each points

let q = 0
for(let i = 0; i < NUM_ROWS * NUM_COLS * NUM_FLOORS * 8; i++){
    //const new_arrow = arrow.clone();
    //new_arrow.position.set(points[i][0], points[i][1], points[i][2])
    //new_arrow.rotateX(angles[i])
    //new_arrow.rotateY(angles[i+1])
    //new_arrow.rotateZ(angles[i+2])
    //new_arrow.setRotationFromQuaternion(quaternions[q]);
    //scene.add( new_arrow );
    q++;
}
    this.animate = this.animate.bind(this);
    requestAnimationFrame( this.animate );
    window.addEventListener('resize', this.resize.bind(this), false);

    this.clock = new THREE.Clock()
    this.delta = 0;
  }

  animate () {
    requestAnimationFrame( this.animate );

    this.controls.update();
    this.render();
    this.elapsedTime = this.clock.getElapsedTime();
    // Update controls
    this.delta += this.clock.getDelta();
    this.testMaterial.uniforms.uTime.value = this.elapsedTime;
    this.meshLineMaterials.forEach((m,i) => {this.meshLineMaterials[i].dashOffset +=0.0008;});
  }

  render () {
    this.renderer.render( this.scene, this.camera );
  }

  resize () {
    const {clientHeight, clientWidth} = this.el.parentElement;


    this.camera.aspect = clientWidth / clientHeight;
    this.camera.updateProjectionMatrix();
    this.background.style({aspect: this.camera.aspect});
    this.renderer.setSize(clientWidth, clientHeight);
  }

  drawLines() {
    for (let index = 0; index < this.params.numLines; index++) {
      //generate random pos
      const initial_pos = new THREE.Vector3( Math.random() * 1, Math.random() * 1 , Math.random() * 1)
      const randCurvePoints = new Array(30).fill().map(() => initial_pos.add(new THREE.Vector3(4 - Math.random() * 8, 4 - Math.random() * 8, 2 - Math.random() * 4)).clone())
      const flowCurvePoints = this.drawCurve(initial_pos)
      for (let index = 0; index < flowCurvePoints.length; index++) {
          //console.log(flowCurvePoints[index]);
      }
      if(flowCurvePoints.length < 1){
          continue
      }
      //this.params.catmullpoints
      const flowcurve = new THREE.CatmullRomCurve3(flowCurvePoints).getPoints(this.params.catmullpoints);
      const randcurve = new THREE.CatmullRomCurve3(randCurvePoints).getPoints(200);

      for (let index = 0.0; index < 4; index++) {
          const line = this.GetLine({
              points: flowcurve,
              color: this.colors[parseInt(this.colors.length * Math.random())],
              width: Math.max(this.params.lineWidth/5, this.params.lineWidth * Math.random()),
              speed: Math.max(0.0001, 0.0005 * Math.random()),
              offset: 0
            });
          this.scene.add(line)
          this.lines.push(line)
      }
    }
  }
  //getlines
  GetLine({ points, width, color, speed, offset }) {
    let meshLineMaterial = new MeshLineMaterial( {color: this.colors[parseInt(this.colors.length * Math.random())], lineWidth: Math.max(this.params.lineWidth/5, this.params.lineWidth * Math.random()), opacity: this.params.opacity,
    transparent: true,  depthTest: false, dashArray: this.params.dashArray, dashRatio: this.params.dashRatio, dashOffset: 0
} );
    const line = new MeshLine();
    const testPoints = [];
    for (let j = 0; j < Math.PI; j += (Math.random() * Math.PI) / 100) {
        testPoints.push(Math.cos(j), Math.sin(j), 0);
    }
    line.setPoints(points);
    //line.setPoints(testPoints);

    meshLineMaterial.dashOffset = 0;
    const mesh = new THREE.Mesh(line, meshLineMaterial);
    this.meshLineMaterials.push(meshLineMaterial);
    return mesh;
}

  //drawCurve
  drawCurve(initial_pos){
    let numSteps = 300
    let curvePoints = []
    let step_length = 0.2
    var pos = initial_pos
    //console.log("init curve")
  
    for (let i = 0; i < numSteps ; i ++) {
        //draw vertex
        curvePoints.push(new THREE.Vector3(pos.x, pos.y, pos.z))
        //console.log("pos %f %f %f", pos.x, pos.y, pos.z)
  
        let x_offset = pos.x + NUM_ROWS/2
        let y_offset = pos.y + NUM_FLOORS/2
        let z_offset = pos.z + NUM_COLS/2
        //console.log("offset %f %f %f", x_offset, y_offset, z_offset)
        let row_index = parseInt(x_offset)
        let floor_index = parseInt(y_offset)
        let columns_index = parseInt(z_offset)
        //console.log("r:%d f: %d c: %d", row_index, floor_index, columns_index)
  
        //(z * xMax * yMax) + (y * xMax) + x;
  
        let index = (columns_index * NUM_ROWS * NUM_FLOORS) + (floor_index * NUM_ROWS) + row_index;
        //you want to check the bounds here
        if(index >= 0 && index < NUM_ROWS * NUM_COLS * NUM_FLOORS * 8){
            //console.log("index %f", index)
            let grid_q = this.quaternions[index]
            var step = new THREE.Vector3(-1,0,0)
            step.applyQuaternion(grid_q)
            //console.log(step)
  
            let nextPos = pos.add(step.multiplyScalar(step_length))
            //console.log("nextpos %f, %f, %f", nextPos.x, nextPos.y, nextPos.z)
            pos = nextPos
       }
       else{
            let grid_q = this.quaternions[Math.abs(index % ( NUM_ROWS * NUM_COLS * NUM_FLOORS * 8 ))]
            //console.log("index %f", index)
  
            var step = new THREE.Vector3(-1,0,0)
            step.applyQuaternion(grid_q)
            //console.log("curr %f, %f, %f", pos.x, pos.y, pos.z)
            let nextPos = pos.add(step.multiplyScalar(step_length))
            //console.log("next %f, %f, %f", nextPos.x, nextPos.y, nextPos.z)
            pos = nextPos
       }
    }
    return curvePoints
  }
  clearLines() {
  
    this.lines.forEach( function( l ) {
      this.scene.remove( l );
    } );
    this.lines = [];
    
  }  
}

  
 
  
  //const pos = new THREE.Vector3(10 - Math.random() * 20, 10 - Math.random() * 20, 10 - Math.random() * 20)
  //const curvePoints = new Array(30).fill().map(() => GetNextPoint(pos))
 
module.exports = Viewer;



  
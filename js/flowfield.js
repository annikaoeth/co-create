import './style.css'
import * as THREE from 'three'
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'three.meshline';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// /**
//  * Base
//  */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('white')
scene.add(new THREE.AxesHelper())

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 10
camera.position.z = 0
camera.lookAt(0,0,0)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.xr.enabled = true;
//document.body.appendChild( VRButton.createButton( renderer ) );


// add GUI

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
		clearLines();
		drawLines();
	}
};
const params = new Params()
const gui = new dat.GUI()


window.addEventListener( 'load', function() {

	function update() {
        clearLines();
        drawLines();
	}
	gui.add( params, 'numLines', 1, 300 ).onChange( update );
    gui.add( params, 'catmullpoints', 1, 300 ).onChange( update );
	gui.add( params, 'lineWidth', 1, 20 ).onChange( update );
	gui.add( params, 'dashArray', 0, 3 ).onChange( update );
	gui.add( params, 'dashRatio', 0, 1 ).onChange( update );
	gui.add( params, 'taper', [ 'none', 'linear', 'parabolic', 'wavy' ] ).onChange( update );
    gui.add( params, 'opacity' ).onChange( update );
	gui.add( params, 'animateDash' );
} );




const LineFolder = gui.addFolder('Lines')

const particlesGeometry = new THREE.BufferGeometry()
// const position = new Float32Array(quantityPoints*3)
// position.forEach((e,i) => {position[i] = Math.random()})

var points = [];
var angles = [];
var quaternions = [];
var lines = [];
var NUM_ROWS = 10;
var NUM_COLS = 10;
var NUM_FLOORS = 10;
let n  = 0
for(var i = 0; i <NUM_ROWS; i+=0.5){
    for(var j = 0; j <NUM_COLS; j+=0.5){
        for(var k = 0; k <NUM_FLOORS; k+=0.5){
            //console.log("%f %f %f", i-NUM_ROWS/2, k-NUM_FLOORS/2, j-NUM_COLS/2)
            //console.log("ind: %d %d %d", i, k ,j)
            //console.log("ind: %d", n)
            //n++
            points.push([i-NUM_ROWS/2, k-NUM_FLOORS/2 ,j-NUM_COLS/2]);
            const X = (i / NUM_ROWS) * Math.PI
            const Y = (j / NUM_COLS) * Math.PI
            const Z = (k / NUM_COLS) * Math.PI

            angles.push([X, Y, Z])
            const q = new THREE.Quaternion()
            q.setFromEuler(new THREE.Euler( X, Y, Z, 'XYZ' ))
            quaternions.push(q)
        }
    }
}

var particleArr = points.flat(2);
particleArr = Float32Array.from(points);
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particleArr ,3));

const testMaterial = new THREE.ShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
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

var meshLineMaterials = [];

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

function GetLine({ points, width, color, speed, offset }) {
    let meshLineMaterial = new MeshLineMaterial( {color: color, lineWidth: width, opacity: params.opacity,
    transparent: true,  depthTest: false, dashArray: params.dashArray, dashRatio: params.dashRatio, dashOffset: offset
} );
    const line = new MeshLine();
    const testPoints = [];
    for (let j = 0; j < Math.PI; j += (Math.random() * Math.PI) / 100) {
        testPoints.push(Math.cos(j), Math.sin(j), 0);
    }
    line.setPoints(points);
    //line.setPoints(testPoints);

    meshLineMaterial.dashOffset = offset;
    const mesh = new THREE.Mesh(line, meshLineMaterial);
    meshLineMaterials.push(meshLineMaterial);
    return mesh;
}

function drawCurve(initial_pos){
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
            let grid_q = quaternions[index]
            var step = new THREE.Vector3(-1,0,0)
            step.applyQuaternion(grid_q)
            //console.log(step)

            let nextPos = pos.add(step.multiplyScalar(step_length))
            //console.log("nextpos %f, %f, %f", nextPos.x, nextPos.y, nextPos.z)
            pos = nextPos
       }
       else{
            let grid_q = quaternions[Math.abs(index % ( NUM_ROWS * NUM_COLS * NUM_FLOORS * 8 ))]
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


//const pos = new THREE.Vector3(10 - Math.random() * 20, 10 - Math.random() * 20, 10 - Math.random() * 20)
//const curvePoints = new Array(30).fill().map(() => GetNextPoint(pos))
const colors = ['#A2CCB6', '#FCEEB5', '#EE786E', '#e0feff', 'lightpink', 'lightblue']
function drawLines() {
    for (let index = 0; index < params.numLines; index++) {
        //generate random pos
        const initial_pos = new THREE.Vector3( Math.random() * 1, Math.random() * 1 , Math.random() * 1)
        const randCurvePoints = new Array(30).fill().map(() => initial_pos.add(new THREE.Vector3(4 - Math.random() * 8, 4 - Math.random() * 8, 2 - Math.random() * 4)).clone())
        const flowCurvePoints = drawCurve(initial_pos)
        
        for (let index = 0; index < flowCurvePoints.length; index++) {
            //console.log(flowCurvePoints[index]);
        }
        if(flowCurvePoints.length < 1){
            continue
        }
        const flowcurve = new THREE.CatmullRomCurve3(flowCurvePoints).getPoints(params.catmullpoints);
        const randcurve = new THREE.CatmullRomCurve3(randCurvePoints).getPoints(200);

        for (let index = 0.0; index < 4; index++) {
            const line = GetLine({
                points: flowcurve,
                color: colors[parseInt(colors.length * Math.random())],
                width: Math.max(params.lineWidth/5, params.lineWidth * Math.random()),
                speed: Math.max(0.0001, 0.0005 * Math.random()),
                offset: 0
              });
            scene.add(line)
            lines.push(line)
        }
    }
}
function clearLines() {

	lines.forEach( function( l ) {
		scene.remove( l );
	} );
	lines = [];

}


const particles = new THREE.Points(particlesGeometry, testMaterial);
//scene.add(particles)

drawLines();

/**
 * Animate
 */
 const clock = new THREE.Clock()
 let delta = 0;
 

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();
    // Update controls
    controls.update();
    delta += clock.getDelta();
    testMaterial.uniforms.uTime.value = elapsedTime;
    meshLineMaterials.forEach((m,i) => {meshLineMaterials[i].dashOffset +=0.0008;});
}
tick();

renderer.setAnimationLoop( function () {
    tick();
	renderer.render( scene, camera );
} );
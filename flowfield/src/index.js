const THREE = window.THREE = require('three');
const dat = require('dat.gui');
const MeshLine = require('three.meshline').MeshLine;
const MeshLineMaterial = require('three.meshline').MeshLineMaterial;
const MeshLineRaycast = require('three.meshline').MeshLineRaycast;
const DEFAULT_CONFIG = require('./config');
const Viewer = require('./viewer');
const download = require('downloadjs');

class App {
  constructor (el) {
    this.config = Object.assign({}, DEFAULT_CONFIG);

    this.viewer = new Viewer(el);

    this.exportCtrl = null;

    this.textureLoader = new THREE.TextureLoader();

    this.addGUI();

    

    
  }

  addGUI () {
    const gui = this.gui = new dat.GUI();
    
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
  const params = new Params();
  }

  makeField () {
    this.viewer.drawLines();
  }



}
const app = new App(document.querySelector('#container'));

app.makeField();
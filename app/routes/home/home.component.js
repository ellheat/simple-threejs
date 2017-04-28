import React, { PureComponent } from 'react';
import * as THREE_JS from 'three';
import * as THREE_ADDONS from 'three-addons';
import { random } from 'lodash';
import { PerformanceMonitor } from '../components/performanceMonitor/performanceMonitor.component';

const knightUrl = require('!!file-loader?name=[hash].[name].js!../../models/knight'); //eslint-disable-line
const jsonUrl = require('!!file-loader?name=[hash].[name].js!../../models/1_11.json'); //eslint-disable-line
const OrbitControls = require('three-orbit-controls')(THREE_JS);

const THREE = { ...THREE_JS, ...THREE_ADDONS };
const APPTENSION_GREEN = 0x95d32c;
const GREY = 0x0e141c;
const NUMBER_OF_ELEMENTS = 50;
const STARTING_POSITION = -26;
const DELAY = 500;


export class Home extends PureComponent {
  constructor() {
    super();
    this.camera = null;
    this.controls = null;
    this.loader = new THREE.JSONLoader();
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.composer = new THREE.EffectComposer(this.renderer);
    this.mixer = new THREE.AnimationMixer(this.scene);
    this.clock = new THREE.Clock();
    this.cubesArray = [];
  }

  componentDidMount() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.home.appendChild(this.renderer.domElement);
    this.initLights();
    this.initCamera();
    this.initControls();
    this.initWall();
    this.initCubes();
    this.initModel();
    this.animation();
  }

  initModel = () => {
    this.loader.load(jsonUrl, (geometry, materials) => {
      this.createModel(geometry, materials);
    });
  };

  createModel(geometry, materials) {
    const material = materials[0];
    material.morphTargets = true;
    material.color.setHex(0xffaaaa);

    const model = new THREE.Mesh(geometry, material);

    model.position.set(0, 0, 10);
    model.scale.set(0.2, 0.2, 0.2);

    model.matrixAutoUpdate = false;
    model.updateMatrix();

    this.scene.add(model);

    this.mixer.clipAction(geometry.animations[0], model)
      .setDuration(4)
      .startAt(- Math.random())
      .play();
  }

  initWall = () => {
    const planeGeometry = new THREE.PlaneGeometry(200, 200, 1);
    const material = new THREE.MeshPhongMaterial({ color: GREY, aoMapIntensity: 0 });
    const plane = new THREE.Mesh(planeGeometry, material);

    plane.position.set(0, 0, -50);

    this.scene.add(plane);
  };

  initLights = () => {
    const directionalLight = new THREE.DirectionalLight(0xdddddd, 0.7);
    const directionalLight2 = new THREE.DirectionalLight(0xdddddd, 0.7);

    directionalLight.position.set(0.35, 0, 1).normalize();
    directionalLight2.position.set(-0.35, 0, 1).normalize();

    this.scene.add(directionalLight, directionalLight2);
  };

  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  initCamera() {
    const viewSize = 50;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / height;

    const left = -aspectRatio * viewSize / 2;
    const right = aspectRatio * viewSize / 2;
    const top = viewSize / 2;
    const bottom = -viewSize / 2;

    this.camera = new THREE.OrthographicCamera(left, right, top, bottom, -1000, 1000);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  createCube(boxGeometry, material) {
    const cube = {
      element: new THREE.Mesh(boxGeometry, material),
      speed: random(0.03, 0.1),
      scale: random(0.5, 1.3),
    };

    cube.element.position.set(random(-100.0, 40.0), STARTING_POSITION, random(-40.0, 40.0));
    cube.element.scale.set(cube.scale, cube.scale, cube.scale);
    cube.element.rotation.set(random(0.1, 1), random(0.1, 1), random(0.1, 1));

    this.cubesArray.push(cube);
    this.scene.add(cube.element);
  }

  changeCubePosition = (cube) => {
    cube.element.position.x = random(-100.0, 40.0);
    cube.element.position.y = STARTING_POSITION;
  };

  initCubes() {
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: APPTENSION_GREEN });

    for (let i = this.cubesArray.length; i < NUMBER_OF_ELEMENTS; i++) {
      setTimeout(() => {
        this.createCube(boxGeometry, material);
      }, DELAY + i * DELAY);
    }
  }

  animation = () => {
    requestAnimationFrame(this.animation);
    this.cubesArray.forEach((cube) => {
      cube.element.rotation.x += random(0.00, 0.05);
      cube.element.rotation.y += random(0.00, 0.05);
      cube.element.position.x += cube.speed;
      cube.element.position.y += cube.speed;

      if (cube.element.position.y > 26) {
        this.changeCubePosition(cube);
      }
    });

    this.renderer.render(this.scene, this.camera);
    this.composer.render();
    this.mixer.update(this.clock.getDelta());
    this.controls.update();
  };

  render() {
    return (
      <div className="home" ref={(home) => {this.home = home;}} >
        <PerformanceMonitor />
      </div>
    );
  }
}

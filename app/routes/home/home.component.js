import React, { PureComponent } from 'react';
import * as THREE from 'three';
import { random } from 'lodash';

import { PerformanceMonitor } from '../components/performanceMonitor/performanceMonitor.component';

const APPTENSION_GREEN = 0x95d32c;
const NUMBER_OF_ELEMENTS = 50;
const STARTING_POSITION = -26;
const DELAY = 500;

export class Home extends PureComponent {
  constructor() {
    super();
    this.camera = null;
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.light = new THREE.DirectionalLight(APPTENSION_GREEN, 1.7);
    this.cubesArray = [];
  }

  componentDidMount() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.home.appendChild(this.renderer.domElement);
    this.initCamera();
    this.initCubes();
    this.animation();
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
  }

  createCube(geometry, material) {
    const cube = {
      element: new THREE.Mesh(geometry, material),
      speed: random(0.07, 0.2),
      scale: random(0.5, 1.3),
    };

    cube.element.position.x = random(-100.0, 40.0);
    cube.element.position.y = STARTING_POSITION;
    cube.element.position.z = random(-40.0, 40.0);

    cube.element.scale.y = cube.scale;
    cube.element.scale.x = cube.scale;
    cube.element.scale.z = cube.scale;

    cube.element.rotation.x = random(0.1, 1);
    cube.element.rotation.y = random(0.1, 1);
    cube.element.rotation.z = random(0.1, 1);

    this.cubesArray.push(cube);
    this.scene.add(cube.element);
  }

  changeCubePosition = (cube) => {
    cube.element.position.x = random(-100.0, 40.0);
    cube.element.position.y = STARTING_POSITION;
  };

  initCubes() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: APPTENSION_GREEN });

    this.light.position.set(0, 0, 1).normalize();
    this.scene.add(this.light);

    for (let i = this.cubesArray.length; i < NUMBER_OF_ELEMENTS; i++) {
      setTimeout(() => {
        this.createCube(geometry, material);
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
  };

  render() {
    return (
      <div className="home" ref={(home) => {this.home = home;}} >
        <PerformanceMonitor />
      </div>
    );
  }
}

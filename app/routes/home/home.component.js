import React, { PureComponent } from 'react';
import * as THREE from 'three';
import { random } from 'lodash';

import { PerformanceMonitor } from '../components/performanceMonitor/performanceMonitor.component';

const APPTENSION_GREEN = 0x95d32c;
const NUMBER_OF_ELEMENTS = 100;

export class Home extends PureComponent {
  constructor() {
    super();
    this.camera = null;
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer();
    this.light = new THREE.DirectionalLight(APPTENSION_GREEN , 1.7);
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

  initCubes() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: APPTENSION_GREEN });

    this.light.position.set(0, 0, 1).normalize();
    this.scene.add(this.light);

    for (let i = 0; i < NUMBER_OF_ELEMENTS; i++) {
      const cube = new THREE.Mesh(geometry, material);
      const scaleValue = random(0.5, 1.3);

      cube.position.x = random(-40.0, 40.0);
      cube.position.y = random(-25.0, 25.0);
      cube.position.z = random(-25.0, 25.0);

      cube.scale.y = scaleValue;
      cube.scale.x = scaleValue;
      cube.scale.z = scaleValue;

      cube.rotation.x = random(0.1, 1);
      cube.rotation.y = random(0.1, 1);
      cube.rotation.z = random(0.1, 1);

      this.cubesArray.push(cube);
      this.scene.add(cube);
    }
  }

  animation = () => {
    requestAnimationFrame(this.animation);
    this.cubesArray.forEach((cube) => {
      cube.rotation.x += random(0.00, 0.05);
      cube.rotation.y += random(0.00, 0.05);
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

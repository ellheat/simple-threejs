import React, { PureComponent } from 'react';
import * as THREE from 'three';

import { PerformanceMonitor } from '../components/performanceMonitor/performanceMonitor.component';

export class Home extends PureComponent {
  constructor() {
    super();
    this.scene = new THREE.Scene();
    this.aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(100, this.aspect, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.cube = null;
  }

  componentDidMount() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.home.appendChild(this.renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshNormalMaterial();
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
    this.camera.position.z = 5;

    this.init();
  }

  init = () => {
    requestAnimationFrame(this.init);
    this.cube.rotation.x += 0.02;
    this.cube.rotation.y += 0.01;
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

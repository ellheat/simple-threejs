import React, { PureComponent } from 'react';
import Stats from 'stats.js';

export class PerformanceMonitor extends PureComponent {
  constructor() {
    super();
    this.stats = new Stats();
    this.stats.showPanel(0);
  }

  componentDidMount() {
    this.monitor.appendChild(this.stats.dom);
    requestAnimationFrame(this.animateMonitor);
  }

  animateMonitor = () => {
    this.stats.begin();
    this.stats.end();
    requestAnimationFrame(this.animateMonitor);
  };

  render() {
    return (
      <div className="performance-monitor" ref={(monitor) => {this.monitor = monitor;}} />
    );
  }
}

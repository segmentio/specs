
import React, { Component } from 'react';
import moment from 'moment';
import styles from './index.css';

export default class ContainerInstanceStats extends Component {
  render() {
    const container = this.props.containerInstance;
    const { 
      runningTasksCount, 
      pendingTasksCount, 
      registeredResources,
      remainingResources,
      attributes,
    } = container;

    const cpuRegistered = registeredResources.find(r => r.name === "CPU");
    const cpuAvailable = remainingResources.find(r => r.name === "CPU");

    const memRegistered = registeredResources.find(r => r.name === "MEMORY");
    const memAvailable = remainingResources.find(r => r.name === "MEMORY");

    const instanceType = attributes.find(a => a.name === 'ecs.instance-type').value;
    const az = attributes.find(a => a.name === 'ecs.availability-zone').value;

    return (
      <div className={styles.ContainerInstanceStats}>
        <div className={styles.ContainerInstanceStatsInfo}>
          <span className="instance-type">{instanceType}</span>
          {' - '}
          <span className="az">{az}</span>          
        </div>
        <table>
          <tbody>
            <tr>
              <th>Tasks</th>
              <td>{runningTasksCount}</td>
            </tr>
            <tr>
              <th>CPU</th>
              <td>{cpuRegistered.integerValue - cpuAvailable.integerValue} / {cpuRegistered.integerValue}</td>
            </tr>
            <tr>
              <th>Memory</th>
              <td>{memRegistered.integerValue - memAvailable.integerValue} / {memRegistered.integerValue}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
};

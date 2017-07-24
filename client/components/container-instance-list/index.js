
import React, { Component } from 'react';
import classname from 'classname';
import moment from 'moment';
import styles from './index.css';
import ContainerInstanceStats from '../container-instance-stats';

export default class ContainerInstanceList extends Component {
  render() {
    const containers = this.matchingContainers();

    if (!containers.length) {
      return null;
    }

    return (
      <div className={styles.ContainerListWrapper}>
        <h2>Container Instances:</h2>
        <ul className={styles.ContainerList}>
          {containers.map(::this.renderContainerItem)}
        </ul>
      </div>
    );
  }

  renderContainerItem(container, n) {
    const clusterName = container.clusterArn.split('cluster/')[1];
    const instanceId = container.ec2InstanceId;
    return (
      <li key={n + container.containerInstanceArn} className={styles.ContainerListItem}>
        <div>
          <h3>{container.ec2InstanceId}</h3>
          <ContainerInstanceStats containerInstance={container} />
        </div>
      </li>
    );
  }

  matchingContainers() {
    const containers = this.props.containerInstances;
    const activeClusterArn = this.props.activeClusterArn;

    const filtered = containers.filter(function(container) {
      if (!activeClusterArn) return false; // don't render if no cluster selected
      return container.clusterArn === activeClusterArn;
    });

    // Sort by AZ
    filtered.sort((left, right) => {
      const leftVal = left.attributes.find(a => a.name === 'ecs.availability-zone').value;
      const rightVal = right.attributes.find(a => a.name === 'ecs.availability-zone').value;

      if (leftVal == rightVal) { 
        return 0;
      }

      return leftVal < rightVal ? -1 : 1;
    });

    return filtered;
  }
};

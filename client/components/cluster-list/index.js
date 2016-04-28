
import React, { Component } from 'react';
import classname from 'classname';
import { Link } from 'react-router';
import styles from './index.css';

export default class ClusterList extends Component {
  render() {
    return (
      <div className={styles.ClusterList}>
        <h2>clusters</h2>
        <ul>
          {this.renderAllItem()}
          {this.props.clusters.map(::this.renderClusterItem)}
        </ul>
      </div>
    );
  }

  renderAllItem() {
    const isActive = !this.props.activeClusterArn;
    const classes = classname({
      [styles.ClusterListItem]: true,
      [styles['ClusterListItem--is-active']]: isActive,
    });
    return (
      <li key="all_clusters" className={classes}>
        <Link to="/">
          all
        </Link>
      </li>
    );

    function handleClick() {
      this.props.onClick(null);
    }
  }

  renderClusterItem(cluster) {
    const isActive = cluster.clusterArn === this.props.activeClusterArn;
    const classes = classname({
      [styles.ClusterListItem]: true,
      [styles['ClusterListItem--is-active']]: isActive,
    });

    return (
      <li key={cluster.clusterArn} className={classes}>
        <Link to={`/${cluster.clusterName}`}>
          {cluster.clusterName}
        </Link>
      </li>
    );

    function handleClick() {
      this.props.onClick(cluster);
    }
  }
};

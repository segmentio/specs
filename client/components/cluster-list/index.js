
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
          {this.renderItem(null)}
          {this.props.clusters.map(::this.renderItem)}
        </ul>
      </div>
    );
  }

  renderItem(item) {
    const isActive = item
      ? item.clusterArn === this.props.activeClusterArn
      : !this.props.activeClusterArn;
    const classes = classname({
      [styles.ClusterListItem]: true,
      [styles['ClusterListItem--is-active']]: isActive,
    });
    return (
      <li key={item ? item.clusterArn : 'all_clusters'} className={classes}>
        <Link to={item ? `/${item.clusterName}` : '/'}>
          {item ? item.clusterName : 'all'}
        </Link>
      </li>
    );
  }
};

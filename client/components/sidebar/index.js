
import React, { Component } from 'react';
import Search from '../search';
import ClusterList from '../cluster-list';
import styles from './index.css';

export default class Sidebar extends Component {
  render() {
    return (
      <div className={styles.Sidebar}>
        <Search
          searchTerm={this.props.searchTerm}
          setSearchTerm={this.props.setSearchTerm} />
        <ClusterList
          clusters={this.props.clusters}
          activeClusterArn={this.props.activeClusterArn}
          onClick={this.props.selectCluster} />
      </div>
    );
  }
};

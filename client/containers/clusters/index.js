
import React, { Component } from 'react';
import request from 'superagent';
import Batch from 'batch';
import flatten from 'flatten';
import Loader from 'react-loader';
import ErrorMessage from '../../components/error-message';
import Sidebar from '../../components/sidebar';
import ServiceList from '../../components/service-list';
import Service from '../service';
import styles from './index.css';

export default class ClustersContainer extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      error: null,
      clusters: [],
      services: [],
      activeClusterArn: null,
      activeServiceArn: null
    };
  }

  /**
   * Render.
   */

  render() {
    const activeClusterArn = this.getActiveClusterArn();
    const isLoading = !!this.state.error || !!this.state.services.length;
    return (
      <div className={styles.ClustersContainer}>
        <header>
          <h1>specs</h1>
          <p>peer into your ecs clusters</p>
        </header>
        <div className={styles.ClustersContainerContent}>
          <Sidebar
            clusters={this.state.clusters}
            activeClusterArn={activeClusterArn}
            searchTerm={this.state.searchTerm}
            setSearchTerm={::this.setSearchTerm}
            selectCluster={::this.setActiveCluster} />
          <Loader loaded={isLoading} color="#3cc76a">
            {this.renderError()}
            <ServiceList
              services={this.state.services}
              searchTerm={this.state.searchTerm}
              activeClusterArn={activeClusterArn} />
          </Loader>
        </div>

        {this.renderServiceSheet()}
      </div>
    )
  }

  /**
   * Get the active cluster ARN.
   */

  getActiveClusterArn() {
    if (this.state.activeClusterArn) {
      return this.state.activeClusterArn;
    }

    const clusterName = this.props.params.clusterName;
    const cluster = this.getByName('cluster', clusterName);
    // TODO: if no matching cluster, show an error
    return cluster && cluster.clusterArn;
  }

  /**
   * Set the current search term.
   */

  setSearchTerm(str) {
    this.setState({ searchTerm: str });
  }

  /**
   * Set the active cluster ARN.
   */

  setActiveCluster(cluster) {
    this.setState({
      activeClusterArn: cluster && cluster.clusterArn
    });
  }

  /**
   * Render the service sheet.
   */

  renderServiceSheet() {
    const serviceName = this.props.params.serviceName;
    if (!serviceName) return null;
    const service = this.getByName('service', serviceName);
    // TODO: if no matching service is found, show an error
    return <Service service={service} />
  }

  /**
   * Render the error.
   */

  renderError() {
    return this.state.error
      ? <ErrorMessage error={this.state.error} />
      : null;
  }

  /**
   * Get item of `type` by its `name`.
   */

  getByName(type, name) {
    const items = type === 'service'
      ? this.state.services
      : this.state.clusters;
    const prop = `${type}Name`;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item[prop] === name) {
        return item;
      }
    }

    return null;
  }

  /**
   * Fetch data.
   */

  componentDidMount() {
    request
    .get('/api/clusters')
    .end(function(err, res) {
      if (err) {
        return this.setState({ error: err.message });
      }

      const { clusters } = res.body;
      this.setState({ clusters });

      const batch = new Batch;
      clusters.forEach(function(cluster) {
        batch.push(function(done) {
          request
          .get(`/api/clusters/${cluster.clusterName}`)
          .end(function(err, res) {
            if (err) return done(err);
            done(null, res.body);
          });
        });
      });

      batch.end(function(err, res) {
        if (err) {
          return this.setState({ error: err.message });
        }

        this.setState({ services: flatten(res) });
      }.bind(this));
    }.bind(this))
  }
};

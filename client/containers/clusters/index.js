
import React, { Component } from 'react';
import request from 'superagent';
import Batch from 'batch';
import flatten from 'flatten';
import Loader from 'react-loader';
import Page from '../../components/page';
import ErrorMessage from '../../components/error-message';
import Sidebar from '../../components/sidebar';
import ServiceList from '../../components/service-list';
import Service from '../service';

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
      <Page>
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
        {this.renderServiceSheet()}
      </Page>
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
    const cluster = this.findCluster(clusterName);
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
    const clusterName = this.props.params.clusterName;
    const serviceName = this.props.params.serviceName;
    if (!serviceName) return null;
    const service = this.findService(clusterName, serviceName);
    if (!service) return null;
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
   * Get cluster by its `name`.
   */

  findCluster(name) {
    return this.state.clusters.find((cluster) => {
      return cluster.clusterName == name;
    });
  }

  /**
   * Get service by its `clusterName` and `serviceName`.
   */

  findService(clusterName, serviceName) {
    const cluster = this.findCluster(clusterName);
    if (!cluster) {
      return;
    }

    return this.state.services.find((service) => {
      return service.clusterArn === cluster.clusterArn &&
        service.serviceName === serviceName;
    });
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

      const clusters = res.body;
      this.setState({ clusters });

      for (let i = 0; i < clusters.length; i++) {
        this.fetchServices(clusters[i]);
      }
    }.bind(this));
  }

  /**
   * Fetch services for the given `cluster`.
   */

  fetchServices(cluster) {
    request
    .get(`/api/clusters/${cluster.clusterName}`)
    .end(function(err, res) {
      if (err) {
        err = err || new Error(`unable to fetch information on ${cluster.clusterName} (${res.status})`);
        return this.setState({ error: err.message });
      }

      const { services } = this.state;
      services.push(res.body);
      this.setState({
        services: flatten(services)
      });
    }.bind(this));
  }
};

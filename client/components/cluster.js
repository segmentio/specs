
import { ServiceView } from "./service";
import { Link } from "react-router";
import request from "superagent";
import moment from "moment";
import React from "react";

/**
 * Render a cluster list item.
 */

let ClusterItem = React.createClass({
  getInitialState() {
    let state = this.props.data;
    state.services = [];
    return state;
  },

  componentDidMount() {
    request
      .get('/services')
      .query({ cluster: this.state.clusterArn })
      .end((err, res) => {
        if (err) throw err;
        this.setState({ services: res.body });
      });
  },

  render() {
    let state = this.state;
    let name = state.clusterName;
    let serviceNames = state.services.map((service) => {
      return service.serviceName;
    });

    return (
      <div className="clusterItem">
        <Link to={`/cluster/${name}`}>
          <h3>{name}</h3>
        </Link>
        <div>instances: {state.registeredContainerInstancesCount}</div>
        <div>{state.activeServicesCount} services: {serviceNames.join(', ')}</div>
        <div>
             running: {state.runningTasksCount}, 
             pending: {state.pendingTasksCount}
        </div>
      </div>
    );
  }
});

/**
 * Render an overview of all the clusters in a list.
 */

let ClustersOverview = React.createClass({
  getInitialState() {
    return { clusters: [] };
  },

  componentDidMount() {
    request
      .get('/clusters')
      .end((err, res) => {
        if (err) throw err;
        this.setState({ clusters: res.body.clusters });
      });
  },

  render() {
    let items = this.state.clusters;
    let els = items.map((item) => {
      return <ClusterItem data={item} key={item.clusterArn} />;
    });

    return (
      <div className="clusterView">
        {els}
      </div>
    );
  }
});

/**
 * Render a detailed view for an individual cluster, 
 * with all the services included.
 */

let ClusterView = React.createClass({
  getInitialState() {
    return { services: [] };
  },
 
  componentDidMount() {
    request
      .get('/services')
      .query({ cluster: this.props.params.cluster })
      .end((err, res) => {
        if (err) throw err;
        this.setState({ services: res.body })
      });
  },

  render() {
    let els = this.state.services.map((item) => {
      return <ServiceView key={item.serviceArn} data={item} />;
    });

    return (
      <div>{els}</div>
    );
  }
});

export { ClustersOverview, ClusterItem, ClusterView }

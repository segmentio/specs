
import React, { Component } from 'react';
import classname from 'classname';
import moment from 'moment';
import { Link } from 'react-router';
import ServiceStats from '../service-stats';
import styles from './index.css';

export default class ServiceList extends Component {
  render() {
    const services = this.matchingServices();
    return (
      <ul className={styles.ServiceList}>
        {services.map(::this.renderServiceItem)}
      </ul>
    );
  }

  renderServiceItem(service) {
    const { runningCount, desiredCount } = service;
    const { name, image } = service.task.containerDefinitions[0];
    const updated = moment(service.deployments[0].updatedAt).fromNow();
    // HACK: pull the cluster name from its arn
    const clusterName = service.clusterArn.split('cluster/')[1];
    return (
      <li key={service.serviceArn} className={styles.ServiceListItem}>
        <Link to={`/${clusterName}/${service.serviceName}`}>
          <h3>{service.serviceName}</h3>
          <ServiceStats service={service} />
        </Link>
      </li>
    );
  }

  matchingServices() {
    const services = this.props.services;
    const activeClusterArn = this.props.activeClusterArn;
    const searchTerm = (this.props.searchTerm || '').toLowerCase();

    // first, all matches on the cluster
    const matchesCluster = services.filter(function(service) {
      if (!activeClusterArn) return true;
      return service.clusterArn === activeClusterArn;
    });

    // then, attempt to match a search filter
    const matchesSearch = matchesCluster.filter(function(service) {
      if (!searchTerm) return true;
      return service.serviceName.indexOf(searchTerm) !== -1;
    });

    return matchesSearch;
  }
};

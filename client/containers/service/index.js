
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import classname from 'classname';
import moment from 'moment';
import { Link, browserHistory } from 'react-router';
import Sheet from '../../components/sheet';
import ServiceEventList from '../../components/service-event-list';
import ServiceStats from '../../components/service-stats';
import styles from './index.css';

export default class Service extends Component {
  render() {
    return (
      <div className={styles.Service}>
        <Sheet onClose={::this.closeSheet}>
          <h1 tabIndex="-1" ref="heading">{this.props.service.serviceName}</h1>
          <ServiceStats service={this.props.service} left={true} />
          <ServiceEventList events={this.props.service.events} />
        </Sheet>
      </div>
    );
  }

  /**
   * Close the sheet.
   */

  closeSheet() {
    const { service } = this.props;
    const clusterName = service.clusterArn.split('cluster/')[1];
    browserHistory.push(`/${clusterName}`);
  }

  /**
   * Put focus in the sheet.
   */

  componentDidMount() {
    findDOMNode(this.refs.heading).focus();
  }
};

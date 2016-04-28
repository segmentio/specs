
import React, { Component } from 'react';
import moment from 'moment';
import classname from 'classname';
import styles from './index.css';

export default class ServiceStats extends Component {
  render() {
    const { service } = this.props;
    const { runningCount, desiredCount } = service;
    const { image } = service.task.containerDefinitions[0];
    const updated = moment(service.deployments[0].updatedAt).fromNow();
    const classes = classname({
      [styles.ServiceStats]: true,
      [styles['ServiceStats--left-aligned']]: this.props.left
    });
    return (
      <div className={classes}>
        <table>
          <tbody>
            <tr>
              <th>Image</th>
              <td>{image}</td>
            </tr>
            <tr>
              <th>Running</th>
              <td>{runningCount} out of {desiredCount}</td>
            </tr>
            <tr>
              <th>Updated</th>
              <td>{updated}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
};

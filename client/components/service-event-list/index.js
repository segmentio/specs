
import React, { Component } from 'react';
import uniq from 'uniq';
import moment from 'moment';
import styles from './index.css';

export default class ServiceEventList extends Component {
  render() {
    const events = this.filterEvents();
    return (
      <div className={styles.ServiceEventList}>
        <ul>
          {events.map(::this.renderEvent)}
        </ul>
      </div>
    );
  }

  /**
   * Filter events.
   */

  filterEvents() {
    const unique = uniq(this.props.events, function(a, b) {
      return a.message === b.message
        ? 0
        : 1;
    }, true);
    return unique;
  }

  /**
   * Render an event.
   */

  renderEvent({ id, createdAt, message }) {
    const timestamp = moment(createdAt).fromNow();
    return (
      <li key={id} className={styles.ServiceEventListItem}>
        <span className={styles['ServiceEventListItem-message']}>
          {message}
        </span>
        <span className={styles['ServiceEventListItem-timestamp']}>
          ({timestamp})
        </span>
      </li>
    );
  }
};


import React, { Component } from 'react';
import styles from './index.css';

export default class ErrorMessage extends Component {
  render() {
    return (
      <div className={styles.ErrorMessage}>
        <h2>Oh no!  An error occured in that request.</h2>
        <h3>{this.props.error}</h3>
      </div>
    );
  }
};

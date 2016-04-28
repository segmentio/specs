
import React, { Component } from 'react';
import styles from './index.css';

export default class Search extends Component {
  render() {
    return (
      <div className={styles.Search}>
        <input
          placeholder="Service..."
          type="search"
          value={this.props.value}
          name="search"
          onChange={::this.handleChange} />
      </div>
    );
  }

  handleChange(e) {
    this.props.setSearchTerm(e.target.value);
  }
};

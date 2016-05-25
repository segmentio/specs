
import React, { Component } from 'react';
import keyname from 'keyname';
import styles from './index.css';

export default class Sheet extends Component {
  render() {
    return (
      <div className={styles.SheetOverlay} onClick={::this.handleOverlayClick} onKeyDown={::this.handleOverlayKeydown}>
        <div className={styles.Sheet} onClick={::this.handleSheetClick}>
          {this.props.children}
        </div>
      </div>
    );
  }

  componentDidMount() {
    document.body.classList.add(styles.NotScrollable)
  }

  componentWillUnmount() {
    document.body.classList.remove(styles.NotScrollable)
  }

  /**
   * Close.
   */

  onClose() {
    this.props.onClose();
  }

  /**
   * Close on "escape" keypresses.
   */

  handleOverlayKeydown(e) {
    const key = keyname(e.which);
    if (key == 'esc') {
      this.onClose();
    }
  }

  /**
   * Close sheet on overlay click.
   */

  handleOverlayClick() {
    this.onClose();
  }

  /**
   * Don't let clicks on the sheet bubble to the overlay.
   */

  handleSheetClick(e) {
    e.stopPropagation();
  }
};

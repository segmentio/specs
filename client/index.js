
/**
 * Module dependencies.
 */

import { render } from 'react-dom';
import React, { Component } from 'react';
import { Router, Route, browserHistory } from 'react-router';
import ClustersContainer from './containers/clusters';
import styles from './index.css';

const root = document.getElementById('root');

root.className = styles.App;

const app = (
  <Router history={browserHistory}>
    <Route path="/" component={ClustersContainer} />
    <Route path="/:clusterName" component={ClustersContainer} />
    <Route path="/:clusterName/:serviceName" component={ClustersContainer} />
  </Router>
);

render(app, root);

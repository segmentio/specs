import { ClustersOverview, ClusterView } from './cluster';
import { Router, Route } from 'react-router';
import React from 'react';

/**
 * Render our main dashboard, and set up our routes.
 */

let Dashboard = React.createClass({
  render() {
    return (
      <Router>
        <Route path="/" component={ClustersOverview} />
        <Route path="/cluster/:cluster" component={ClusterView} />
      </Router>
    )    
  }
});

export default Dashboard;
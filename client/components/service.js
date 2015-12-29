
import moment from "moment";
import React from "react";
import uniq from "uniq";

/**
 * Renders an individual service.
 */

let ServiceView = React.createClass({
  render() {
    let item = this.props.data;

    return (
      <div>
        <h3>{item.serviceName}</h3>
        <div>running: {item.runningCount} out of {item.desiredCount}</div>
        <div>last updated: {moment(item.deployments[0].updatedAt).fromNow()}</div>
        <div>image: {item.task.containerDefinitions[0].image}</div>
        <div>events:</div>
        <EventsView events={item.events} />
      </div>        
    );    
  }
});

/**
 * Render the list of events for a service (deploys,
 * errors, etc.)
 */

let EventsView = React.createClass({
  render() {
    let events = uniq(this.props.events, (a, b) => {
      return a.message == b.message ? 0 : 1;
    }, true);

    let els = events.map((event) => {
      return <li>{event.message} ({moment(event.createdAt).fromNow()})</li>;
    });
    return <ul>{els}</ul>;
  }
})

export { ServiceView }

import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import classname from 'classname';
import moment from 'moment';
import { Link, browserHistory } from 'react-router';
import { Tabs, TabLink, TabContent } from 'react-tabs-redux';
import Sheet from '../../components/sheet';
import ServiceEventList from '../../components/service-event-list';
import ServiceStats from '../../components/service-stats';
import ServiceTaskDef from '../../components/service-task-def';
import styles from './index.css';

const activeLinkStyle = {
  'border-bottom-color': '#fff',
  'color': '#54585E',
};

export default class Service extends Component {
  render() {
    return (
      <div className={styles.Service}>
        <Sheet onClose={::this.closeSheet}>
          <h1 tabIndex="-1" ref="heading">{this.props.service.serviceName}</h1>
          <ServiceStats service={this.props.service} left={true} />
          <Tabs className={styles.ServiceTabs} activeLinkStyle={activeLinkStyle}>
            <nav className={styles['ServiceTabs-navigation']}>
              <ul>
                <li>
                  <a href="#" onClick={e => e.preventDefault()}>
                    <TabLink to="task_def">Task Def</TabLink>
                  </a>
                </li>
                <li>
                  <a href="#" onClick={e => e.preventDefault()}>
                    <TabLink to="events">Events</TabLink>
                  </a>
                </li>
              </ul>
            </nav>

            <div className={styles['ServiceTabs-content']}>
              <TabContent for="events">
                <ServiceEventList events={this.props.service.events} />
              </TabContent>
              <TabContent for="task_def">
                <ServiceTaskDef
                  family={this.props.service.task.family}
                  revision={this.props.service.task.revision}
                  definition={this.props.service.task.containerDefinitions[0]} />
              </TabContent>
            </div>
          </Tabs>
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

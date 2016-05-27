
import React, { Component } from 'react';
import moment from 'moment';
import classname from 'classname';
import styles from './index.css';

export default class ServiceTaskDef extends Component {
  render() {
    const { family, revision, definition } = this.props;
    const command = definition.command ? definition.command.join(' ') : null;
    return (
      <div className={styles.ServiceTaskDef}>
        <table>
          <tbody>
            <tr>
              <th>task def</th>
              <td>{family}:{revision}</td>
            </tr>
            <tr>
              <th>CPU</th>
              <td>{definition.cpu}</td>
            </tr>
            <tr>
              <th>memory</th>
              <td>{definition.memory}</td>
            </tr>
            <tr>
              <th>command</th>
              <td>
                <code>{command}</code>
              </td>
            </tr>
            <tr>
              <th>environment</th>
              <td>
                <ul className={styles.ServiceTaskDefEnvVars}>
                  {definition.environment.map(({ name, value }) =>
                    <li key={`__${family}_${revision}_env_${name}`}><code>{name}={value}</code></li>
                  )}
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
};

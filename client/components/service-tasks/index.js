
import React, { Component } from 'react';
import moment from 'moment';
import classname from 'classname';
import styles from './index.css';

const awsRegion = process.env.AWS_REGION

export default class ServiceTasks extends Component {
  render() {
    const { tasks, service, clusterName } = this.props;

    return (
      <div>
        {tasks.map((task, index) => {
          const revision = task.taskDefinitionArn.split("/")[1];

          return (
            <ul key={`task-${index}`} className={styles.ServiceTask}>
              <table>
                <tbody>
                  <tr>
                    <th>Task</th>
                    <td title={task.taskArn}>
                      <a href={`https://${awsRegion}.console.aws.amazon.com/ecs/home?region=${awsRegion}#/clusters/${clusterName}/tasks/${task.taskArn.split('/')[1]}/details`}>
                        {task.taskArn.split('/')[1]}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <th>task def</th>
                    <td>
                      <a href={`https://${awsRegion}.console.aws.amazon.com/ecs/home?region=${awsRegion}#/taskDefinitions/${revision.split(":").join("/")}`}>
                        {revision}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <th>Last status</th>
                    <td title={task.lastStatus}>{task.lastStatus}</td>
                  </tr>
                  <tr>
                    <th>Desired status</th>
                    <td title={task.desiredStatus}>{task.desiredStatus}</td>
                  </tr>
                </tbody>
              </table>
            </ul>
          )
        }
      )}
      </div>
    );
  }
};

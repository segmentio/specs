
import React, { Component } from 'react';
import moment from 'moment';
import classname from 'classname';
import styles from './index.css';

const awsRegion = process.env.AWS_REGION

const Task = ({ task, clusterName }) => {
  const [family, revision] = task.taskDefinitionArn.split('/');
  const taskId = task.taskArn.split('/')[0];

  return (
    <ul className={styles.ServiceTask}>
      <table>
        <tbody>
          <tr>
            <th>Task</th>
            <td title={task.taskArn}>
              <a href={`https://${awsRegion}.console.aws.amazon.com/ecs/home?region=${awsRegion}#/clusters/${clusterName}/tasks/${taskId}/details`}>
                {taskId}
              </a>
            </td>
          </tr>
          <tr>
            <th>task def</th>
            <td>
              <a href={`https://${awsRegion}.console.aws.amazon.com/ecs/home?region=${awsRegion}#/taskDefinitions/${family}/${revision}`}>
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
  );
}

export default class ServiceTasks extends Component {
  render() {
    const { tasks, clusterName } = this.props;

    return (
      <div>
        {tasks.map((task, i) => <Task key={task.taskArn} task={task} clusterName={clusterName} />)}
      </div>
    );
  }
};

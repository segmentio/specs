
'use strict'

let debug = require('debug')('ecs');
let Promise = require('bluebird');
let chunk = require('chunk');
let Batch = require('batch');
let co = require('co');

module.exports = ECS;

/**
 * Create a new ECS client.
 *
 * @param {AWS} aws - an aws client
 */

function ECS(aws){
  this.ecs = new aws.ECS();
}

/**
 * Return a promise to return the full list of
 * clusters.
 *
 * @public
 * @return {Promise} [clusters]
 */

ECS.prototype.clusters = function(){
  debug('ecs.clusters()');
  return this.listClusters()
    .bind(this)
    .then(this.describeClusters);
};

/**
 * Return a promise to return the full list of
 * services for a cluster.
 *
 * @public
 * @param {String} cluster - the cluster arn 
 * @return {Promise} [services]
 */

ECS.prototype.services = function(cluster){
  debug('ecs.services(%s)', cluster);
  return this.listServices(cluster)
    .bind(this)
    .then(this.describeServices);
};

/**
 * Lists all the clusters from the API.
 *
 * @private
 */

ECS.prototype.listClusters = function(){
  let ecs = this.ecs;
  debug('ecs.listClusters()');
  return new Promise((resolve, reject) => {
    ecs.listClusters((err, data) => {
      debug('ecs.listClusters received reponse', err, data);
      if (err) return reject(err);
      resolve(data.clusterArns);
    });
  });
}

/**
 * Describes individual clusters.
 *
 * @private
 * @param {Array[string]} clusters
 * @return {Promise}
 */

ECS.prototype.describeClusters = function(clusters){
  let ecs = this.ecs;
  debug('ecs.describeClusters()'); 
  return new Promise((resolve, reject) => {
    ecs.describeClusters({ clusters: clusters }, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

/**
 * Lists all the services for a cluster
 *
 * @private
 * @param {String} cluster
 */

ECS.prototype.listServices = function(cluster){
  let ecs = this.ecs;
  debug('ecs.listServices()'); 
  return new Promise((resolve, reject) => {
    let services = [];
    list(cluster, null, (err, services) => {
      if (err) return reject(err);
      resolve([cluster, services]);
    });

    function list(cluster, token, fn){
      ecs.listServices({ cluster: cluster, nextToken: token }, (err, data) => {
        if (err) return fn(err);
        let {nextToken, serviceArns} = data;
        services = services.concat(serviceArns);
        if (nextToken) return list(cluster, nextToken, fn);
        fn(null, services);
      });
    }
  })
}

/**
 * Describe individual services, passed from the promise resolved
 * from listServices
 *
 * @private
 * @param {Array} [cluster, services]
 */

ECS.prototype.describeServices = function ([cluster, services]){
  let ecs = this.ecs;
  debug('ecs.describeServices called'); 
  return new Promise((resolve, reject) => {
    let chunks = chunk(services, 10);
    let batch = new Batch();

    // describe the services in chunks of 10,
    // the max limit for ECS
    chunks.forEach((services) => batch.push(describe(services)));

    batch.end((err, results) => {
      if (err) return reject(err);
      let services = [];
      // combine our results and pass them back
      results.forEach((result) => {
        services = services.concat(result.services);
      });
      resolve(services);
    });

    function describe(services) {
      return function (done){
        let req = { cluster, services };
        ecs.describeServices(req, done);
      };
    }
  }); 
}

/**
 * Describes an individual task
 *
 * @public
 * @param {String} task the task arn
 */

ECS.prototype.task = function (task){
  return new Promise((resolve, reject) => {
    let req = { taskDefinition: task };
    this.ecs.describeTaskDefinition(req, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
}
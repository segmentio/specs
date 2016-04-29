'use strict'

let debug = require('debug')('ecs:cache');
let defer = require('co-defer');
let co = require('co');
let ms = require('ms');

module.exports = Cache;

function Cache(ecs){
  this.ecs = ecs;
  this.start();
}

/**
 * Starts our cache polling for
 * changes from ECS.
 */

Cache.prototype.start = function(){
  let poll = this.poll.bind(this);
  defer(poll);
  defer.setInterval(function *(){
    yield poll();
  }, ms('45s'));
};

/**
 * Polls ECS for the most recent cluster
 * definitions.
 */

Cache.prototype.poll = function *(){
  debug('polling ecs...');
  let ecs = this.ecs;
  
  // retrieve the cluster definitions
  let clusters = yield ecs.clusters();
  clusters = clusters.clusters;
  debug('received %d clusters', Object.keys(clusters).length);

  // from all the clusters, retrieve the services
  let serviceCalls = clusters.map(cluster => {
    return ecs.services(cluster.clusterArn);
  })
  let services = yield Promise.all(serviceCalls);
  services = flatten(services);

  // from all the tasks, get the versions running
  let taskCalls = services.map(service => ecs.task(service.taskDefinition));
  let tasks = yield Promise.all(taskCalls);
  services.forEach((service, i) => service.task = tasks[i].taskDefinition);
  debug('received %d services', services.length);
  this.cache(clusters, services);
};

/**
 * Return the clusters
 */

Cache.prototype.clusters = function(){
  return this._clusters;
}

/**
 * Return the services, optionally filtered by
 * cluster.
 *
 * @param {String} cluster [optional]
 */

Cache.prototype.services = function(cluster){
  if (!cluster) return this._services;
  return this._services.filter(service => {
    return clusterName(service.clusterArn) == cluster;
  });
};

/**
 * Sets the existing clusters and services in
 * the cache
 *
 * @param {Array} clusters
 * @param {Array} services
 */

Cache.prototype.cache = function(clusters, services){
  this._clusters = clusters;
  this._services = services;
};

/**
 * Flatten our list of lists into a single array.
 */

function flatten(arrays) {
  var output = [];
  arrays.forEach(arr => output = output.concat(arr));
  return output;
}

function clusterName(arn){
  return arn.split('/')[1];
}
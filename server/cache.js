'use strict'

let LRU = require('lru-cache');
let debug = require('debug')('ecs:cache');
let inherits = require('util').inherits;
let defer = require('co-defer');
let Emitter = require('events');
let co = require('co');
let ms = require('ms');

module.exports = Cache;

/**
 * Cache constructor
 *
 * @param {ECS} ecs  ecs client
 */

function Cache(ecs){
  Emitter.call(this);
  this.tasks = LRU({
    max: 1000000,
    maxAge: ms('1d'),
    length: (val, key) => 1
  });
  this.ecs = ecs;
  this.cache([], []); // initial state
  this.start();
}

inherits(Cache, Emitter);

/**
 * Starts our cache polling for
 * changes from ECS.
 */

Cache.prototype.start = function(){
  let poll = this.poll.bind(this);
  defer(poll, err => {
    if (err) this.emit('error', err);
  });

  let self = this;
  defer.setInterval(function *(){
    try {
      yield poll();
    } catch (err) {
      self.emit('error', err);
    }
  }, ms('1m'));
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
  debug('received %d services', services.length);

  // from all the tasks, get the versions running, then cache the result.
  let taskCache = this.tasks;
  let taskCalls = services.map(service => {
    let task = taskCache.get(service.taskDefinition);
    if (task) {
      return Promise.resolve(task);
    }
    return ecs.task(service.taskDefinition).then(task => {
      taskCache.set(service.taskDefinition, task);
      return task;
    });
  });
  let tasks = yield Promise.all(taskCalls);
  services.forEach((service, i) => service.task = tasks[i].taskDefinition);
  debug('received %d tasks', services.length);
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
